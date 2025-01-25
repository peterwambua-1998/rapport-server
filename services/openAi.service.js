const config = require("../config/config.config");
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

// const generateLLMResponse = async (userProfile) => {
//   try {
//     const response = await openai.chat.completions.create({
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are an expert CV analyzer and interview preparation assistant. Based on the given profile, generate interview preparation questions tailored to the user's professional title, skills, and years of experience.",
//         },
//         {
//           role: "user",
//           content: JSON.stringify(userProfile),
//         },
//       ],
//       model: config.openai.model,
//       max_tokens: config.openai.maxTokens,
//       temperature: config.openai.temperature,
//       n: 1,
//       stop: null,
//     });

//     const assistantResponse = response.choices[0].message.content;
//     return assistantResponse;
//   } catch (error) {
//     console.error("Error generating LLM response:", error);
//     throw error;
//   }
// };

const generateLLMResponse = async (userProfile) => {
  try {
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert interview preparation assistant.
            Based on the given profile, generate interview preparation questions and 
            answers tailored to the user's skills, skill level and years of experience.
            Generate a JSON object with a top-level key "questions" that contains all the required data. 
            Do not nest an extra "questions" key within the "questions" object. 
            The output should only have a single top-level "questions" key. use this format
            [{
              "question": "Can you describe?",
              "answer": "In my previous role"
            },]`,
        },
        {
          role: "user",
          content: JSON.stringify(userProfile),
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


module.exports = generateLLMResponse;
