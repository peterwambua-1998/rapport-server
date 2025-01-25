const { PDFLoader } = require('@langchain/community/document_loaders/fs/pdf')
const { writeFile, unlink } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { z } = require('zod');
const { StructuredOutputParser } = require('@langchain/core/output_parsers')
const { ChatOpenAI } = require('@langchain/openai');
const { PromptTemplate } = require('@langchain/core/prompts')
const { RunnableSequence } = require('@langchain/core/runnables');

exports.processFile = async (file, type) => {
    try {
        let loader;
        let documents;

        if (type == "application/pdf") {
            loader = new PDFLoader(file);
            documents = await loader.load();
        }

        if (type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            loader = new DocxLoader(file);
            documents = await loader.load();
        }
        
        const fullText = documents.map(doc => doc.pageContent).join('\n');

        const educationSchema = z.object({
            school: z.string().nullable(),
            degree: z.string().nullable(),
            major: z.string().nullable(),
            startDate: z.coerce.date().nullable(),
            endDate: z.coerce.date().nullable(),
        });

        const workExperienceSchema = z.object({
            position: z.string().nullable(),
            employer: z.string().nullable(),
            description: z.string().nullable(),
            startDate: z.coerce.date().nullable(),
            endDate: z.coerce.date().nullable(),
            currentlyWorking: z.boolean().default(false).describe('Indicates whether the work experience is current ie working there currently or not')
        });

        const certificationSchema = z.object({
            name: z.string().nullable(),
            organization: z.string().nullable(),
        });

        const skillSchema = z.object({
            name: z.string().nullable(),
            proficiency: z.string().describe('It is the expertise level of skill eg beginner, intermediate, advanced or expert').nullable(),
        });

        const profileSchema = z.object({
            AboutMe: z.string().nullable(),
            ProfessionalTitle: z.string().nullable(),
            Location: z.string().nullable(),
            Industry: z.string().nullable(),
            YearsofExperience: z.number().nullable(),
            CurrentRole: z.string().nullable(),
            Company: z.string().nullable(),
            LinkedInProfileUrl: z.string().nullable(),
            PortfolioUrl: z.string().nullable(),
            GithubUrl: z.string().nullable(),
            Education: z.array(educationSchema),
            WorkExperience: z.array(workExperienceSchema),
            Certifications: z.array(certificationSchema),
            Skills: z.array(skillSchema),
        });

        const parser = StructuredOutputParser.fromZodSchema(profileSchema);

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
              If you cannot find a specific piece of information, use null. Also add a summary of the text, highlights and recommendations
              
              {format_instructions}
              
              Text: {text}
              
              Extracted Information:`,
            inputVariables: ["text"],
            partialVariables: {format_instructions: formatInstructions},
        });

        const input = await prompt.format({
            text: fullText,
        });

        const chain = RunnableSequence.from([
            prompt,
            model,
            parser,
        ]);

        const response = await chain.invoke({
            text: input
        });

        return response;
    } catch (error) {
        console.error("Error extracting profile data:", error);
        // Return a structured response with all null values
        return {
            AboutMe: null,
            Location: null,
            Industry: null,
            YearsofExperience: null,
            CurrentRole: null,
            Company: null,
            LinkedInProfileUrl: null,
            PortfolioUrl: null,
            Education: [],
            WorkExperience: [],
            Certifications: [],
            Skills: [],
        };
    }
}