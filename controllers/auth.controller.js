const {
  User,
  RecruiterProfile,
  JobSeeker,
  JobSeekerStat,
  AdminToken,
} = require("../models");
const crypto = require("crypto");
const { Op } = require("sequelize");
const { sendEmail } = require("../services/email.service");
const bcrypt = require("bcrypt");
const { google } = require("googleapis");
const TokenManager = require("../services/tokenManager.service");

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
        return res.json({ status: false, msg: "error occurred" }).status(500);
      }
      res
        .json({ status: true, msg: "registration successful", user: user })
        .status(200);
    });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, error: "Sorry error occured!!!" });
  }
};

exports.registerJobseeker = async (req, res) => {
  try {
    const { fName, mName, lName, email, phone, password } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use!" });
    }

    // Check for existing phone
    const existingPhone = await JobSeeker.findOne({ where: { phone } });
    if (existingPhone) {
      return res.status(400).json({ error: "Phone already in use!" });
    }

    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      fName,
      mName,
      lName,
      email,
      phone,
      password,
      role: "job_seeker",
      verificationToken,
      isVerified: false,
    });



    await sendEmail(user.email, "registration", {
      name: user.fName,
      verificationLink: verificationToken
    })

    res.json({ status: true, msg: "registration successful", user: user });
  } catch (error) {
    res.status(400).json({ status: false, error: "Error occurred please try again!" });
  }
}

exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: "User not found!" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await user.update({ verificationToken: code })

    await sendEmail(user.email, "registration", {
      name: user.fName,
      verificationLink: code
    })

    res.json({ status: true, msg: "Verification code sent successfully" });
  } catch (error) {
    console.log(error)
    res.status(400).json({ status: false, error: error })
  }
}

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
  const { newPassword } = req.body;
  try {
    const user = await User.findByPk(req.user.id);
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
      name: `${user.fName} ${user.lName}`,
      email: user.email,
      role: user.role,
    }

    await JobSeekerStat.create({
      userId: user.id,
      profileViews: 0,
      searchAppearance: 0,
      interviewsCompleted: 0,
      challengesCompleted: 0,
      daysOnPlatform: 1
    });

    req.login(authUser, function (err) {
      if (err) {
        return res.json({ status: false, msg: 'error occurred' }).status(500);
      }
      res.json({ status: true, msg: 'Email verification successfull', user: user }).status(200)
    });
  } catch (error) {
    res.status(500).json('An error occurred during verification.');
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
    res.status(500).send('An error occurred while setting the password.');
  }
}

exports.logout = async (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json("Error logging out");
    }
    res.status(201).json({ message: "Successfuly loged out", success: true });
  });
};

exports.getCurrentUser = async (req, res) => {
  return res.json({ user: req.user });
}

exports.youTubeAuthorization = async (req, res) => {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      process.env.YOUTUBE_REDIRECT_URI
    );

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/youtube.upload']
    });

    res.redirect(authUrl);
  } catch (error) {
    console.log(error)
    res.redirect('http://localhost:5173/admin/dashboard');
  }
}

exports.youTubeCallback = async (req, res) => {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      process.env.YOUTUBE_REDIRECT_URI
    );

    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    const tokenManager = new TokenManager();
    await tokenManager.saveToken(tokens);
    // Save tokens to a secure storage in production
    res.redirect(`${process.env.FRONTEND_URL}/admin/youtube/authorization?valid=true`);
  } catch (error) {
    console.log(error)
    res.redirect(`${process.env.FRONTEND_URL}/admin/youtube/authorization?valid=false`);
  }
}

exports.checkYouTube = async (req, res) => {
  try {
    const tokenRecord = await AdminToken.findOne({ where: { id: 1 } });
    if (tokenRecord) {
      return res.json({status: true, message: '"YouTube account found.'});
    }
    return res
      .status(404)
      .json({ status: false, error: "YouTube account not found." });
  } catch (error) {
    return res
      .status(404)
      .json({ status: false, error: "YouTube account not found." });
  }
}