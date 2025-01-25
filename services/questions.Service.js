const { z } = require('zod');
const { StructuredOutputParser } = require('@langchain/core/output_parsers')
const { ChatOpenAI } = require('@langchain/openai');
const { PromptTemplate } = require('@langchain/core/prompts')
const { RunnableSequence } = require('@langchain/core/runnables');

exports.generateQuestions = async (profileInfo) => {
    try {
        const model = new ChatOpenAI({
            model: "gpt-4o-mini",
            temperature: 0,
            apiKey: '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',
        });

        const QuestionArraySchema = z.object({
            questions: z.array(z.string()).length(10)
        });

        // Create an output parser
        const parser = StructuredOutputParser.fromZodSchema(QuestionArraySchema);

        const formatInstructions = parser.getFormatInstructions();

        const prompt = new PromptTemplate({
            template: `
                Given the following user profile information:
                Profile: {profile}
        
                Generate 10 unique, insightful interview that explore the person's professional background, and skills. Question are supposed to be used for interview preparation.
                The questions should:
                - Manly cover their skills and proficiency of the skill
                - Be professional and relevant to their experience
        
                {format_instructions}
            `,
            inputVariables: ["profile"],
            partialVariables: { format_instructions: formatInstructions },
        });

        const input = await prompt.format({
            profile: JSON.stringify(profileInfo),
        });

        const chain = RunnableSequence.from([
            prompt,
            model,
            parser,
        ]);

        const response = await chain.invoke({
            profile: input
        });

        console.log(response);

        return response;
    } catch (error) {
        console.log(error)
        return [];
    }
}