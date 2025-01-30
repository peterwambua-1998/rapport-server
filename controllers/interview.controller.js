const { Skill, User, Interview, Education, Certification } = require("../models");
const generateInterviewQuestions = require("../services/langChain.service");
const generateLLMResponse = require("../services/openAi.service");
const addQuestionsToQueue = require("../services/processQuesions.service");
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

exports.storeQuestions = async (req, res, next) => {
  try {

    const files = req.files;

    if (!files.video) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    const video_name = files.video[0].filename;
    const video_path = files.video[0].path;

    const questions = JSON.parse(req.body.questions || '[]')
    let format_qtn = questions.join();


    await addQuestionsToQueue({ videoPath: video_path, fileName: video_name, userId: req.user.id, router: 'register', questions: format_qtn });

    return res.json({
      status: "success",
      info: "questions saved"
    })

  } catch (error) {
    console.log(error);
    return res.json(error).status(500);
  }
};

exports.getResults = async (req, res) => {
  try {
    const results = await Interview.findAll({ where: { userId: req.user.id } });
    return res.json(results);
  } catch (error) {
    return res.json(error).status(500);
  }
}
