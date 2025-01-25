const { StructuredOutputParser } = require('@langchain/core/output_parsers');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { RunnableSequence } = require('@langchain/core/runnables');
const { ChatOpenAI } = require("@langchain/openai");
const config = require("../config/config.config");
const { z } = require("zod");

const model = new ChatOpenAI({
    model: "gpt-4o",
    temperature: 0,
    apiKey: config.openai.apiKey,
});

const zodSchema = z.object({
    interview_questions: z.object({
        question: z.array(z.string().max(6).describe("question to return to user")).describe("List of generated interview questions"),
    }),
});

const parser = StructuredOutputParser.fromZodSchema(zodSchema);

const promptTemplate = ChatPromptTemplate.fromTemplate(
    'Based on the following information, generate up to 6 interview questions:\n\n' +
    'Skill Level: {skillLevel}\n\n' +
    'Skills: {skills}\n\n' +
    '{format_instructions}'
);

const chain = RunnableSequence.from([
    promptTemplate,
    model,
    parser,
]);

 async function generateInterviewQuestions(skills, skillLevel) {
    try {
        // Invoke the chain with the provided skills, skill levels
        // const response = await chain.invoke({
        //     skillLevel,
        //     skills,
        //     format_instructions: parser.getFormatInstructions(),
        // });
        // const response = await chain.invoke({inp})
        // Return the generated questions
        return response.questions;
    } catch (error) {
        console.error('Error generating interview questions:', error);
        throw error;
    }
}

module.exports = generateInterviewQuestions;