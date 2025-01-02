const { User, RecruiterProfile } = require("../models");

/**
 * Get all team mebers
 * @param {Object} req
 * @param {Object} res
 */
exports.getTeam = async (req, res) => {
  try {
    const user = await RecruiterProfile.findOne({ where: { user_id: req.user.id } });
    let recruiters = [];

    if (user) {
      if (user.company_id) {
        recruiters = await User.findAll({
          where: {
            role: "recruiter",
          },
          attributes: ['id', 'name', 'email', 'role', 'avatar'],
          include: [
            {
              model: RecruiterProfile,
              required: true,
              where: {
                company_id: user.company_id,
              },
            },
          ],
        });
      }
    }
    return res.status(200).json(recruiters);
  } catch (err) {
    console.error("Error fetching recruiters: ", err);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching recruiters" });
  }
};
