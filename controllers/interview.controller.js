const { Skill, User, PersonalInformation, ProfessionalInformation, Education, Certification, Experience } = require("../models");
const generateInterviewQuestions = require("../services/langChain.service");
const generateLLMResponse = require("../services/openAi.service");
const { generateQuestions } = require("../services/questions.Service");

exports.getQuestions = async (req, res, next) => {
  try {
    const query = await User.findByPk(req.user.id, {
      include: [
        { model: Education },
        { model: Certification },
        { model: Skill },
      ]
    });

    // get questions
    const result = await generateQuestions(query);

    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.json(error).status(500);
  }
};

exports.getResults = async (req, res, next) => {
  try {
  } catch (error) { }
};
