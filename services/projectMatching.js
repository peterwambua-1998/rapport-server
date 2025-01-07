const config = require("../config/config.config");
const OpenAI = require("openai");
const openai = new OpenAI({
    apiKey: "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",
});

exports.matchCandidates = async (candidates, jobDescription) => {
    try {
        const cleanJobDescription = jobDescription.replace(/\n/g, ' ').trim();
        console.log(JSON.stringify({ jobDescription: `${cleanJobDescription}`, candidates }));
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            response_format: { type: "json_object" },
            messages: [{
                role: "system",
                content: "Based on the jobDescription, i want you to analyze the candidates who fit the jobDescription and return a json array with only id and name of the candidates who fit the jobDescription. The json array should look like [{id: '3085ac11-005a-4b71-832c-8c4a32c1ec79',name: 'Mikayla Herrera'}] add only one top level key of candidates."
            }, {
                role: "user",
                content: JSON.stringify({ jobDescription: `${cleanJobDescription}`, candidates })
            }]
        });

        const responseContent = response.choices[0].message.content;
        console.log("Response from OpenAI:");
        console.log(responseContent)

        return JSON.parse(responseContent);
    } catch (error) {
        console.error("Error parsing response:", error);
        return [];
    }
}