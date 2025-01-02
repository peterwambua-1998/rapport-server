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

const openai = new OpenAI({
    apiKey: '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',
});

const gcCredentialsPath = '/opt/bitnami/projects/server/ai-app-49d1e-a7f07b6af0e2.json'; // Replace with your service account JSON file path
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
        console.log(speech.videoPath)
        const job = await speechQueue.add(speech);
        console.log(`Job added to queue with ID: ${job.id}`);
        return job;
    } catch (error) {
        console.error('Error adding job to queue:', error);
        throw error;
    }
};

async function uploadToGCS(filePath, fileName) {
    try {
        await storage.bucket(bucketName).upload(filePath, {
            destination: fileName,
        });
        return `gs://${bucketName}/${fileName}`;
    } catch (error) {
        console.log(error)
        throw error
    }
}


function extractAudio(videoPath, audioPath) {
    return new Promise((resolve, reject) => {
        const command = `ffmpeg -i "${videoPath}" -ac 1 -ar 16000 -q:a 0 -map a "${audioPath}"`;
        exec(command, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve(audioPath);
            }
        });
    });
}

async function transcribeAudio(gcsUri) {
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
    const [operation] = await speechClient.longRunningRecognize(request);
    const [response] = await operation.promise();

    const transcription = response.results
        .map(result => {
            return result.alternatives[0].transcript
        })
        .join(' ');

    return transcription;
}


const extractSkillsAndExperienceAI = async (transcription) => {
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
        return assistantResponse;
    } catch (error) {
        console.error("Error generating LLM response:", error);
        throw error;
    }
};

// my job processor
const speechService = async (job) => {
    try {
        const { videoPath, fileName, userId } = job.data;
        console.log('videoPath===', videoPath)
        const audioPath = path.join('/opt/bitnami/projects/server/uploads/ai_videos', `${path.parse(fileName).name}.wav`);

        await extractAudio(videoPath, audioPath);

        const gcsUri = await uploadToGCS(audioPath, `${path.parse(fileName).name}.wav`);

        const transcription = await transcribeAudio(gcsUri)

        const result = await extractSkillsAndExperienceAI(transcription);

        const jobseeker = await JobSeeker.findOne({where: {userId: userId}});
        jobseeker.update({
            videoAnalysis: result
        })

        console.log(jobseeker)
        console.log(result)

        // Cleanup uploaded files
        fs.unlinkSync(audioPath);
    } catch (error) {
        console.log(error)
    }
}


speechQueue.process(speechService)

module.exports = addSpeechToQueue;

