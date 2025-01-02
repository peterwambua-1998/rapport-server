const config = require("../config/config.config");
const OpenAI = require("openai");
const openai = new OpenAI({
    apiKey: config.openai.apiKey,
});

exports.matchCandidates = async (candidates, jobDescription) => {
    try {

        const cleanJobDescription = jobDescription.replace(/\n/g, ' ').trim();
        console.log(cleanJobDescription)
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{
                role: "system",
                content: "Based on the jobDescription, i want you to analyze the candidates who fit the jobDescription and return a json array with only id and name of the candidates who fit the jobDescription. The json array should look like [{id: '3085ac11-005a-4b71-832c-8c4a32c1ec79',name: 'Mikayla Herrera'}]"
            }, {
                role: "user",
                content: JSON.stringify({ jobDescription: `${cleanJobDescription}` , candidates })
            }]
        });
        return JSON.parse(response.choices[0].message.content);
    } catch (error) {
        console.log(error)
        return [];
    }
}