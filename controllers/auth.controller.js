const {
  User,
  RecruiterProfile,
  JobSeeker,
  JobseekerSkills,
  UserLinkedProfile,
} = require("../models");
const crypto = require("crypto");
const { Op } = require("sequelize");
const { sendEmail } = require("../services/email.service");
const bcrypt = require("bcrypt");
const addSpeechToQueue = require("../services/speech.service");

// Registration for recruiters
exports.register = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    role,
    companyName,
    companyId,
    country,
  } = req.body;
  console.log(req.body)
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, error: "Email already exists" });
    }

    const name = firstName + " " + lastName;
    const user = await User.create({ name, email, password, role: 'recruiter' });
    await RecruiterProfile.create({
      user_id: user.id,
      first_name: firstName,
      last_name: lastName,
      company_name: companyName,
      country: country,
      role: role,
      company_id: companyId !== "" ? companyId : null,
    });

    await sendEmail(user.email, "registration", {
      name: user.name,
      verificationLink: `${process.env.FRONTEND_URL}/`,
    });

    req.login(user, function (err) {
      if (err) {
        console.log(err)
        return res.json({ status: false, msg: "error occurred" }).status(500);
      }
      res
        .json({ status: true, msg: "registration successful", user: user })
        .status(200);
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, error: "Sorry error occured!!!" });
  }
};

// Registration for jobseekers
exports.registerJobseeker = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      professionalTitle,
      industry,
      educationLevel,
      yearsOfExperience,
      skillLevel,
      skills,
      aboutYourself,
      termsAccepted,
      ioUserId, // represent user id from socket
    } = req.body;

    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const password = "password123";
    const files = req.files;
    let video_path, video_name;

    // Check for existing user
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const existingPhone = await JobSeeker.findOne({ where: { phone } });
    if (existingPhone) {
      return res.status(400).json({ error: "Phone already in use" });
    }

    if (files) {
      profile_path = files.profilePicture ? files.profilePicture[0].path : "";
    }

    console.log(files)

    const user = await User.create({
      name: fullName,
      email,
      password,
      role: "job_seeker",
      verificationToken,
      isVerified: false,
      avatar: profile_path
    });

    let vid = {
      "analysis": "",
      "highlights": [],
      "keywords and expertise": [],
      "strengths": [],
      "soft skills": [],
      "experiences": []
    }

    if (files) {
      if (files.video) {
        video_name = files.video[0].filename;
        video_path = files.video[0].path;
      }
    }

    await JobSeeker.create({
      userId: user.id,
      fullName,
      phone,
      professionalTitle,
      address,
      city,
      state,
      zipCode,
      industry,
      educationLevel,
      yearsOfExperience,
      skillLevel,
      about: aboutYourself,
      videoUrl: video_path,
      videoAnalysis: vid,
      backgroundColor: "#205295",
      terms: termsAccepted ? termsAccepted : false,
    });

    if (files) {
      if (files.video) {
        await addSpeechToQueue({ videoPath: video_path, fileName: video_name, userId: user.id, ioUserId, router: 'register' });
      }
    }

    let skillSet = JSON.parse(skills);
    const skillsToInsert = skillSet.map((skill) => ({
      userId: user.id,
      skillId: skill.id,
    }));

    await JobseekerSkills.bulkCreate(skillsToInsert, {
      ignoreDuplicates: true,
    });

    await sendEmail(user.email, "registration", {
      name: user.name,
      verificationLink: verificationToken,
    });

    res
      .json({ status: true, msg: "registration successful", user: user })
      .status(200);
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ success: false, error: "Error occured please try again!!!" });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { role, email } = req.body;
    const user = await User.findOne({ where: { email: email, role: role } });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();
    const userRole = user.role == "job_seeker" ? "jobseeker" : user.role;

    await sendEmail(user.email, "forgot_password", {
      name: user.name,
      resetLink: `${process.env.FRONTEND_URL}/${userRole}/reset-password/${resetToken}`,
    });

    res.status(200).json({ success: true, message: "Email sent" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const resetToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  try {
    const user = await User.findOne({
      where: {
        resetPasswordToken: resetToken,
        resetPasswordExpire: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid or expired token" });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    await sendEmail(user.email, "reset_password_success", {
      name: user.name,
    });

    res.status(200).json({ success: true, message: "Password updated" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findByPk(req.user.id);
    if (!(await user.validatePassword(currentPassword))) {
      return res
        .status(401)
        .json({ success: false, error: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    await sendEmail(user.email, "change_password", {
      name: user.name,
    });
    res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ where: { verificationToken: token } });
    if (!user) {
      return res.status(400).send('Invalid verification link.');
    }

    user.verificationToken = null;
    user.isVerified = true;
    await user.save();

    let authUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    }
    req.login(authUser, function (err) {
      if (err) {
        return res.json({ status: false, msg: 'error occurred' }).status(500);
      }
      res.json({ status: true, msg: 'Email verification successfull', user: user }).status(200)
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred during verification.');
  }
}

exports.setNewPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(400).send('Invalid user.');
    }


    if (user.isVerified) {
      return res.status(400).send('User already verified.');
    }


    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();
    res
      .json({ status: true, msg: "registration successful", user: user })
      .status(200);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while setting the password.');
  }
}

exports.logout = async (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send("Error logging out");
    }
    res.status(201).json({ message: "Successfuly loged out", success: true });
  });
};


exports.getCurrentUser = async (req, res) => {
  if (!req.user) {
    return res.json({ user: {} });
  }

  let user = await User.findByPk(req.user.id, {
    attributes: ['id', 'name', 'email', 'role', 'avatar'],
  });

  if (user.role != 'admin') {
    user = await User.findByPk(req.user.id, {
      include: [
        {
          model: UserLinkedProfile,
          as: 'linkedProfile',
          attributes: ['picture'],
        },
      ],
      attributes: ['id', 'name', 'email', 'role', 'avatar'],
    });
  }

  return res.json({ user: user });
}

