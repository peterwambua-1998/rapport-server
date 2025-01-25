const { Storage } = require('@google-cloud/storage');
const Bull = require('bull')
const speech = require('@google-cloud/speech');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const OpenAI = require("openai");
const {
    PersonalInformation
} = require("../models");
const { sendMessageIo } = require('./socket.service');
const { z } = require('zod');
const { StructuredOutputParser } = require('@langchain/core/output_parsers')
const { ChatOpenAI } = require('@langchain/openai');
const { PromptTemplate } = require('@langchain/core/prompts')
const { RunnableSequence } = require('@langchain/core/runnables');

const openai = new OpenAI({
    apiKey: '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',
});

const gcCredentialsPath = process.cwd() + '/ai-app-49d1e-a7f07b6af0e2.json'; // Replace with your service account JSON file path
// 
process.env.GOOGLE_APPLICATION_CREDENTIALS = gcCredentialsPath;

const storage = new Storage();
const speechClient = new speech.SpeechClient();
const bucketName = 'ai-app-49d1e.appspot.com';

const speechQueue = new Bull('speech')


const addSpeechToQueue = async (speech) => {
    try {
        if (!speech.videoPath || !speech.fileName) {
            throw new Error('Missing required parameters: videoPath or fileName');
        }

        const job = await speechQueue.add(speech);
        const { userId } = speech;

        sendMessageIo(userId, 'video-status-update', { status: 'Queue storage', percentage: 5, error: null });

        console.log(`Job added to queue with ID: ${job.id}`);

        return job;
    } catch (error) {
        console.error('Error adding job to queue:', error);
        throw error;
    }
};


function extractAudio(videoPath, audioPath, userId) {
    return new Promise((resolve, reject) => {
        const command = `ffmpeg -i "${videoPath}" -ac 1 -ar 16000 -q:a 0 -map a "${audioPath}"`;
        exec(command, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve(audioPath);

                sendMessageIo(userId, 'video-status-update', { status: 'extracting audio', percentage: 25, error: null });
            }
        });
    });
}


async function uploadToGCS(filePath, fileName, userId) {
    try {
        await storage.bucket(bucketName).upload(filePath, {
            destination: fileName,
        });

        sendMessageIo(userId, 'video-status-update', { status: 'uploading to gs', percentage: 40, error: null });

        return `gs://${bucketName}/${fileName}`;
    } catch (error) {
        console.log(error)
        throw error
    }
}


async function transcribeAudio(gcsUri, userId) {
    const request = {
        audio: {
            uri: gcsUri,
        },
        config: {
            model: "latest_long",
            sampleRateHertz: '16000',
            languageCode: 'en-US',
        },
    };

    console.log('Transcribing audio...');

    sendMessageIo(userId, 'video-status-update', { status: 'transcribing audio...', percentage: 68, error: null });
    const [operation] = await speechClient.longRunningRecognize(request);

    sendMessageIo(userId, 'video-status-update', { status: 'fetching transcription...', percentage: 88, error: null });
    const [response] = await operation.promise();

    const transcription = response.results
        .map(result => {
            return result.alternatives[0].transcript
        })
        .join(' ');

    return transcription;
}

// using vertex
const vertexExtractInfo = async (transcription, userId) => {
    try {
        const summary = z.string().nullable().describe('A concise summary of the text.');
        const highlights = z.array(z.string()).describe('Key points or achievements highlighted in the text.');
        const recommendations = z.array(z.string()).describe('Suggestions or advice you can provide based on the text.');
        const careerGoalsSchema = z.object({
            name: z.string().nullable(),
        });

        const softSkillsSchema = z.object({
            name: z.string().nullable(),
            proficiency: z.string().describe('It is the expertise level of soft skill eg beginner, intermediate, advanced or expert').default('intermediate'),
        });

        const technicalSkillSchema = z.object({
            name: z.string().nullable(),
            proficiency: z.string().describe('It is the expertise level of technical skill eg beginner, intermediate, advanced or expert').default('intermediate'),
        });

        const workExperienceSchema = z.object({
            position: z.string().nullable(),
            employer: z.string().nullable(),
            description: z.string().nullable(),
            startDate: z.coerce.date().nullable(),
            endDate: z.coerce.date().nullable(),
        });

        const videoSchema = z.object({
            pastExperience: z.array(workExperienceSchema).describe('Hold past experiences'),
            softSkills: z.array(softSkillsSchema).describe('Personality traits, interpersonal skills, and other non-technical attributes (e.g., communication, leadership, teamwork)'),
            technicalSkills: z.array(technicalSkillSchema).describe('Specific job-related abilities and expertise.'),
            careerGoals: z.array(careerGoalsSchema),
            summary,
            highlights,
            recommendations
        });

        const parser = StructuredOutputParser.fromZodSchema(videoSchema);

        const model = new ChatOpenAI({
            model: "gpt-4o-mini",
            temperature: 0,
            apiKey: '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',
        });

        const formatInstructions = parser.getFormatInstructions();

        const prompt = new PromptTemplate({
            template: `
          You are an expert at extracting structured information from text.
          Please analyze the following text and extract relevant profile information.
          If you cannot find a specific piece of information, use null.
          
          {format_instructions}
          
          Text: {text}
          
          Extracted Information:`,
            inputVariables: ["text"],
            partialVariables: { format_instructions: formatInstructions },
        });

        const input = await prompt.format({
            text: transcription,
        });

        const chain = RunnableSequence.from([
            prompt,
            model,
            parser,
        ]);

        const response = await chain.invoke({
            text: input
        });

        sendMessageIo(userId, 'video-status-update', { status: 'transcription  analysis...', percentage: 95, error: null });

        return response;
    } catch (error) {
        console.error("Error generating LLM response:", error);
        throw error;
    }
}

// my job processor
const speechService = async (job) => {
    const { videoPath, fileName, userId } = job.data;
    try {
        const audioPath = path.join(process.cwd() + '/uploads/ai_videos/' + `${path.parse(fileName).name}.wav`);
        await extractAudio(videoPath, audioPath, userId);

        const gcsUri = await uploadToGCS(audioPath, `${path.parse(fileName).name}.wav`, userId);

        const transcription = await transcribeAudio(gcsUri, userId);

        const result = await vertexExtractInfo(transcription, userId);

        const infoExists = await PersonalInformation.findOne({ where: { userId: userId } });
        await infoExists.update({
            videoAnalysis: result
        })

        console.log(result)

        // Cleanup uploaded files
        fs.unlinkSync(audioPath);

        sendMessageIo(userId, 'video-status-update', { status: 'completed', percentage: 100, error: null });

    } catch (error) {
        console.error('Error processing job:', error);
        sendMessageIo(userId, 'video-status-update', { status: 'failed', percentage: 100, error: error.message });
        throw error;
    }
}


speechQueue.process(speechService)

speechQueue.on('failed', (job, err) => {
    const { userId } = job.data;

    sendMessageIo(userId, 'video-status-update', { status: 'failed', percentage: 100, error: err.message });
});

module.exports = addSpeechToQueue;