const { Storage } = require('@google-cloud/storage');
const Bull = require('bull')
const speech = require('@google-cloud/speech');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const OpenAI = require("openai");
const { sendMessageIo } = require('./socket.service');
const { z } = require('zod');
const { StructuredOutputParser } = require('@langchain/core/output_parsers')
const { ChatOpenAI } = require('@langchain/openai');
const { PromptTemplate } = require('@langchain/core/prompts')
const { RunnableSequence } = require('@langchain/core/runnables');
const { Interview, JobSeekerStat } = require("../models");

const gcCredentialsPath = process.cwd() + '/ai-app-49d1e-a7f07b6af0e2.json'; // Replace with your service account JSON file path
// 
process.env.GOOGLE_APPLICATION_CREDENTIALS = gcCredentialsPath;

const storage = new Storage();
const speechClient = new speech.SpeechClient();
const bucketName = 'ai-app-49d1e.appspot.com';

const interviewQueue = new Bull('interview')


const addQuestionsToQueue = async (speech) => {
    try {
        if (!speech.videoPath || !speech.fileName) {
            throw new Error('Missing required parameters: videoPath or fileName');
        }

        const job = await interviewQueue.add(speech);
        const { userId } = speech;

        sendMessageIo(userId, 'question-status-update', { status: 'Queue storage', percentage: 5, error: null });

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

                sendMessageIo(userId, 'question-status-update', { status: 'extracting audio', percentage: 25, error: null });
            }
        });
    });
}


async function uploadToGCS(filePath, fileName, userId) {
    try {
        await storage.bucket(bucketName).upload(filePath, {
            destination: fileName,
        });

        sendMessageIo(userId, 'question-status-update', { status: 'uploading to gs', percentage: 40, error: null });

        return `gs://${bucketName}/${fileName}`;
    } catch (error) {
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

    sendMessageIo(userId, 'question-status-update', { status: 'transcribing audio...', percentage: 68, error: null });
    const [operation] = await speechClient.longRunningRecognize(request);

    sendMessageIo(userId, 'question-status-update', { status: 'fetching transcription...', percentage: 88, error: null });
    const [response] = await operation.promise();

    const transcription = response.results
        .map(result => {
            return result.alternatives[0].transcript
        })
        .join(' ');

    return transcription;
}

const vertexExtractInfo = async (transcription, userId, qtns) => {
    try {
        const interviewResults = z.object({
            grade: z.number().min(0).max(100).describe('How well the questions were answered on a scale of 0 to 100'),
            feedback: z.string().describe('Ways to improve'),
        });

        const parser = StructuredOutputParser.fromZodSchema(interviewResults);

        const model = new ChatOpenAI({
            model: "gpt-4o-mini",
            temperature: 0,
            apiKey: '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',
        });

        const formatInstructions = parser.getFormatInstructions();

        const prompt = new PromptTemplate({
            template: `
            You are an expert at marking questions, where questions are answered using a single text. 
            There are multiple questions separated by a comma.
            Please analyze the following text and determine the result.
            
            Make sure to:
            1. Provide a grade
            2. feedback how user can improve
            
            {format_instructions}
            
            Questions: {questions}
            Text: {text}
          
            Extracted Information:`,
            inputVariables: ["text", "questions"],
            partialVariables: { format_instructions: formatInstructions },
        });

        const input = await prompt.format({
            questions: qtns,
            text: transcription,
        });

        const chain = RunnableSequence.from([
            prompt,
            model,
            parser,
        ]);

        const response = await chain.invoke({
            questions: qtns,
            text: transcription
        })

        sendMessageIo(userId, 'question-status-update', { status: 'transcription  analysis...', percentage: 95, error: null });

        return response;

    } catch (error) {
        console.error("Error generating LLM response:", error);
        throw error;
    }
}

const speechService = async (job) => {
    const { videoPath, fileName, userId, questions } = job.data;
    try {
        const audioPath = path.join(process.cwd() + '/uploads/ai_videos/' + `${path.parse(fileName).name}.wav`);
        await extractAudio(videoPath, audioPath, userId);

        const gcsUri = await uploadToGCS(audioPath, `${path.parse(fileName).name}.wav`, userId);

        const transcription = await transcribeAudio(gcsUri, userId);

        const result = await vertexExtractInfo(transcription, userId, questions);

        await Interview.create({
            userId: userId,
            video: videoPath,
            feedback: result.feedback,
            grade: result.grade,
            questions: questions
        });

        const stats = await JobSeekerStat.findOne({ where: { userId: userId } });
        if (stats) {
            let i = stats.interviewsCompleted ?? 0;
            await stats.update({ interviewsCompleted: i + 1 });
        }

        // Cleanup uploaded files
        fs.unlinkSync(audioPath);

        sendMessageIo(userId, 'question-status-update', { status: 'completed', percentage: 100, error: null });

    } catch (error) {
        console.error('Error processing job:', error);
        sendMessageIo(userId, 'question-status-update', { status: 'failed', percentage: 100, error: error.message });
        throw error;
    }
}

interviewQueue.process(speechService)

interviewQueue.on('failed', (job, err) => {
    const { userId } = job.data;

    sendMessageIo(userId, 'question-status-update', { status: 'failed', percentage: 100, error: err.message });
});

module.exports = addQuestionsToQueue;