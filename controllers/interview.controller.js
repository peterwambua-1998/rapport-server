const { Skill, User, JobSeeker, YearsOfExperience } = require("../models");
const generateLLMResponse = require("../services/openAi.service");

exports.getQuestions = async (req, res, next) => {
  try {
    const id = req.user.id; 
    const user = await User.findByPk(id, {
      attributes: {
        exclude: [
          "resetPasswordToken",
          "resetPasswordExpire",
          "linkedinId",
          "password",
        ],
      },
      include: [
        {
          model: JobSeeker,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: Skill,
          attributes: { exclude: ["createdAt", "updatedAt"] },
          through: { attributes: [] },
        },
      ],
    });

    if (!user) {
      return res.status(500).json({ error: "User not found" });
    }

    if (user.Skills.length == 0) {
      return res.status(500).json({ mgs: "User has no skills" });
    }

    // Extract skills for prompt
    const skillNames = user.Skills.map((skill) => skill.name).join(", ");

    if (!user.JobSeeker) {
      return res.status(500).json({ mgs: "years of exp not found" });
    }

    const yearsOfExperience = await YearsOfExperience.findByPk(
      user.JobSeeker.yearsOfExperience
    );

    const userProfile = {
      yearsOfExperience: yearsOfExperience.name,
      skills: skillNames,
    };
    const result = await generateLLMResponse(userProfile);

    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.json(error).status(500);
  }
};

exports.getResults = async (req, res, next) => {
  try {
  } catch (error) {}
};
