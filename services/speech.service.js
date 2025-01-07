const { Storage } = require('@google-cloud/storage');
const Bull = require('bull')
const speech = require('@google-cloud/speech');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const OpenAI = require("openai");

const {
    JobSeeker,
} = require("../models");
const { sendMessageIo } = require('./socket.service');

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
        const { userId, ioUserId, router } = speech;

        router == 'register' ?
            sendMessageIo(ioUserId, 'video-status-update', { status: 'Queue storage', percentage: 5, error: null }) :
            sendMessageIo(userId, 'video-status-update', { status: 'Queue storage', percentage: 5, error: null });

        console.log(`Job added to queue with ID: ${job.id}`);

        return job;
    } catch (error) {
        console.error('Error adding job to queue:', error);
        throw error;
    }
};


function extractAudio(videoPath, audioPath, userId, ioUserId, router) {
    return new Promise((resolve, reject) => {
        const command = `ffmpeg -i "${videoPath}" -ac 1 -ar 16000 -q:a 0 -map a "${audioPath}"`;
        exec(command, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve(audioPath);
                router == 'register' ?
                    sendMessageIo(ioUserId, 'video-status-update', { status: 'extracting audio', percentage: 25, error: null }) :
                    sendMessageIo(userId, 'video-status-update', { status: 'extracting audio', percentage: 25, error: null });
            }
        });
    });
}


async function uploadToGCS(filePath, fileName, userId, ioUserId, router) {
    try {
        await storage.bucket(bucketName).upload(filePath, {
            destination: fileName,
        });

        router == 'register' ?
            sendMessageIo(ioUserId, 'video-status-update', { status: 'uploading to gs', percentage: 40, error: null }) :
            sendMessageIo(userId, 'video-status-update', { status: 'uploading to gs', percentage: 40, error: null });

        return `gs://${bucketName}/${fileName}`;
    } catch (error) {
        console.log(error)
        throw error
    }
}


async function transcribeAudio(gcsUri, userId, ioUserId, router) {
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
    router == 'register' ?
            sendMessageIo(ioUserId, 'video-status-update', { status: 'transcribing audio...', percentage: 68, error: null }) :
            sendMessageIo(userId, 'video-status-update', { status: 'transcribing audio...', percentage: 68, error: null });
    const [operation] = await speechClient.longRunningRecognize(request);

    router == 'register' ?
            sendMessageIo(ioUserId, 'video-status-update', { status: 'fetching transcription...', percentage: 88, error: null }) :
            sendMessageIo(userId, 'video-status-update', { status: 'fetching transcription...', percentage: 88, error: null });
    const [response] = await operation.promise();

    const transcription = response.results
        .map(result => {
            return result.alternatives[0].transcript
        })
        .join(' ');

    return transcription;
}


const extractSkillsAndExperienceAI = async (transcription, userId, ioUserId, router) => {
    try {
        const response = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `
                    You are tasked with analyzing a transcription and extracting key insights in a structured format. Your output should be a JSON object without a single top-level key and formatted as follows:
                    {
                        "analysis": "A concise summary of the transcription.",
                        "highlights": [
                            "Strong leadership presence and confident communication style",
                            "Clear articulation of complex technical concepts",
                            "Engaging storytelling ability when describing past experiences",
                            "Professional appearance and presentation skills"
                        ],
                        "recommendations": [
                            "Consider adding specific metrics to quantify your achievements",
                            "Include more examples of cross-functional leadership",
                            "Highlight your technical expertise more prominently",
                            "Add recent industry certifications or training"
                        ],
                        "keywords and expertise": [
                            "Product Management",
                            "Tech Leadership",
                            "Agile",
                            "SaaS",
                            "B2B",
                            "Enterprise Software"
                        ],
                        "strengths": [
                            "Strategic Planning",
                            "Team Leadership",
                            "Product Innovation",
                            "Stakeholder Management"
                        ],
                        "soft skills": [
                            "Communication",
                            "Emotional Intelligence",
                            "Conflict Resolution",
                            "Mentoring",
                            "Public Speaking"
                        ],
                    }

                    1. Analysis: Provide a concise summary of the transcription.

                    2. Highlights: List the most notable observations, such as:
                        Strong leadership presence and confident communication style.
                        Clear articulation of complex technical concepts.
                        Engaging storytelling ability.
                        Professional appearance and presentation skills.
                    
                    3. Keywords and Expertise: Extract specific keywords or areas of expertise, for example:
                        Product Management
                        Tech Leadership
                        Agile
                        SaaS
                        B2B
                        Enterprise Software

                    4. Strengths: Identify the individual's core strengths, such as:
                        Strategic Planning
                        Team Leadership
                        Product Innovation
                        Stakeholder Management

                    5. Soft Skills: List relevant soft skills, for example:
                        Communication
                        Emotional Intelligence
                        Conflict Resolution
                        Mentoring
                        Public Speaking
                    `,
                },
                {
                    role: "user",
                    content: JSON.stringify(transcription),
                },
            ],
            model: "gpt-4o",
            response_format: {
                type: "json_object",
            },
            temperature: 1,
            max_completion_tokens: 2048,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        const assistantResponse = response.choices[0].message.content;

        router == 'register' ?
            sendMessageIo(ioUserId, 'video-status-update', { status: 'transcription  analysis...', percentage: 95, error: null }) :
            sendMessageIo(userId, 'video-status-update', { status: 'transcription  analysis...', percentage: 95, error: null });

        return assistantResponse;
    } catch (error) {
        console.error("Error generating LLM response:", error);
        throw error;
    }
};

// my job processor
const speechService = async (job) => {
    const { videoPath, fileName, userId, ioUserId, router } = job.data;
    try {

        const audioPath = path.join(process.cwd() + '/uploads/ai_videos/' + `${path.parse(fileName).name}.wav`);
        await extractAudio(videoPath, audioPath, userId, ioUserId, router);

        const gcsUri = await uploadToGCS(audioPath, `${path.parse(fileName).name}.wav`, userId, ioUserId, router); 

        const transcription = await transcribeAudio(gcsUri, userId, ioUserId, router); 

        const result = await extractSkillsAndExperienceAI(transcription, userId, ioUserId, router);

        const jobseeker = await JobSeeker.findOne({ where: { userId: userId } });
        await jobseeker.update({
            videoAnalysis: result
        })

        console.log(jobseeker)
        console.log(result)

        // Cleanup uploaded files
        fs.unlinkSync(audioPath);
        router == 'register' ?
            sendMessageIo(ioUserId, 'video-status-update', { status: 'completed', percentage: 100, error: null }) :
            sendMessageIo(userId, 'video-status-update', { status: 'completed', percentage: 100, error: null });

    } catch (error) {
        console.error('Error processing job:', error);
        router == 'register' ?
            sendMessageIo(ioUserId, 'video-status-update', { status: 'failed', percentage: 100, error: error.message }) :
            sendMessageIo(userId, 'video-status-update', { status: 'failed', percentage: 100, error: error.message });
        throw error;
    }
}


speechQueue.process(speechService)

speechQueue.on('failed', (job, err) => {
    const { userId, ioUserId, router } = job.data;
    router == 'register' ?
        sendMessageIo(ioUserId, 'video-status-update', { status: 'failed', percentage: 100, error: err.message }) :
        sendMessageIo(userId, 'video-status-update', { status: 'failed', percentage: 100, error: err.message });
});

module.exports = addSpeechToQueue;