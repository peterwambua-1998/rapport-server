const { transformProfileInfo, validateProfileInfo } = require("../helpers/functions");
const {
  User,
  RecruiterProfile,
  JobSeeker,
  JobseekerSkills,
  Skill,
  userVerificationStatus,
  Industry,
  VisibilitySetting,
  Country,
  UserLinkedProfile,
  Company,
  EducationLevel,
  YearsOfExperience,
  SkillLevel,
  PersonalInformation,
  ProfessionalInformation,
  Education,
  Experience,
  Certification,
} = require("../models");
const addSpeechToQueue = require("../services/speech.service");

// Fetch all admins
exports.getAdmins = async (req, res) => {
  try {
    const admins = await User.findAll({
      where: {
        role: "admin",
      },
    });
    return res.status(200).json(admins);
  } catch (err) {
    console.error("Error fetching admins: ", err);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching admins" });
  }
};

// Fetch all recruiters
exports.getRecruiters = async (req, res) => {
  try {
    const recruiters = await User.findAll({
      where: {
        role: "recruiter",
      },
      include: [
        {
          model: RecruiterProfile,
          required: false,
        },
      ],
    });
    return res.status(200).json(recruiters);
  } catch (err) {
    console.error("Error fetching recruiters: ", err);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching recruiters" });
  }
};

// Fetch all job seekers
exports.getJobSeekers = async (req, res) => {
  try {
    const jobSeekers = await User.findAll({
      where: { role: "job_seeker" },
      attributes: {
        exclude: ["resetPasswordToken", "resetPasswordExpire", "linkedinId"],
      },
      include: [
        {
          model: JobSeeker,
          include: [
            {
              model: YearsOfExperience,
            },
            {
              model: SkillLevel,
            },
            {
              model: Industry,
            },
            {
              model: EducationLevel,
            },
          ],
        },
        {
          model: JobseekerSkills,
          include: [
            {
              model: Skill,
            },
          ],
        },
      ],
    });

    return res.status(200).json(jobSeekers);
  } catch (err) {
    console.log(err);
    // console.error("Error fetching job seekers: ", err);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching job seekers" });
  }
};

// recruiter profile
exports.profile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findOne({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ error: "Sorry User not found" });
    }

    let data = {};

    if (user.role == "admin") {
      data = {
        ...user?.toJSON(),
      };
    } else if (user.role == "recruiter") {
      const recruiterProfile = await RecruiterProfile.findOne({
        where: { user_id: userId },
        include: [
          {
            model: Company
          }
        ],
      });

      data = {
        ...user?.toJSON(),
        recruiterProfile: recruiterProfile?.toJSON(),
      };
    } else if (user.role == "job_seeker") {
      data = await User.findOne({
        where: { role: "job_seeker", id: req.user.id },
        include: [
          {
            model: JobSeeker,
            include: [
              { model: Industry },
              { model: EducationLevel },
              { model: SkillLevel },
              { model: YearsOfExperience }
            ],
          },
          {
            model: VisibilitySetting,
          },
          {
            model: UserLinkedProfile,
            as: 'linkedProfile',
          },
          {
            model: JobseekerSkills,
            include: [
              {
                model: Skill,
              },
            ],
          },
        ],
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching recruiter profiles:", error);
    return res.status(404).json({ msg: "Profile not found!" });
  }
};

exports.updateAdminProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findOne({
      where: { role: "admin", id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "Sorry User not found" });
    }

    let avatar = user?.avatar;
    if (req.files && req.files.profilePhoto) {
      avatar = req.files.profilePhoto[0].path;
    }
    console.log(req.files)

    const { name, email } = req.body;
    await user.update({ name: name, email: email, avatar: avatar });
    return res.status(200).json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.log(error)
    console.error("Error updating profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findOne({
      where: { role: "recruiter", id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "Sorry User not found" });
    }

    const {
      firstName,
      lastName,
      email,
      aboutYourself,
    } = req.body;
    const name = firstName + " " + lastName;


    const profileRecruiter = await RecruiterProfile.findOne({
      where: { user_id: user.id },
    });

    let profilePhoto = profileRecruiter?.profile_image_url;
    let cover_photo_url = profileRecruiter?.cover_photo_url;
    let files = req.files;


    if (files) {
      if (files.profilePhoto) {
        profilePhoto = files.profilePhoto[0].path
      }

      if (files.coverPhoto) {
        cover_photo_url = files.coverPhoto[0].path;
      }
    }

    await user.update({
      name: name,
      email: email,
      avatar: profilePhoto,
      cover_photo: cover_photo_url,
    });

    profile = await RecruiterProfile.update(
      {
        first_name: firstName,
        last_name: lastName,
        about: aboutYourself,
        profile_image_url: profilePhoto,
        cover_photo_url: cover_photo_url,
      },
      {
        where: {
          user_id: userId,
        },
      }
    );
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching recruiter profiles:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { newStatus, remarks } = req.body;

    const profile = await User.update(
      {
        status: newStatus,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    await userVerificationStatus.create({
      userId: req.params.id,
      status: `${newStatus}`,
      remarks: remarks,
    });
    return res.status(200).json(profile);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateSeekerProfile = async (req, res) => {
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
      profileVisible,
      activeStatus,
      layout_style,
      color,
      basic_information,
      video_introduction,
      user_skills,
      education,
      experience,
      recommendations,
    } = req.body;

    const userId = req.user.id;
    console.log(req.files.profilePicture)
    // Find the User based on userId
    const user = await User.findOne({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "Sorry, User not found" });
    }

    // Update User's basic information


    const files = req.files;

    const profile = await JobSeeker.findOne({
      where: { userId: userId },
    });

    let vid = {
      "analysis": "",
      "highlights": [],
      "keywords and expertise": [],
      "strengths": [],
      "soft skills": [],
      "experiences": []
    }

    let profile_path;
    let video_path;
    // let results = profile?.videoAnalysis || vid;
    if (files) {
      if (files.profilePicture) {
        profile_path = files.profilePicture[0].path
      }
      if (files.video) {
        let video_name = files.video[0].filename;
        video_path = files.video[0].path;
        // let ai_video_path = "/opt/bitnami/projects/server/" + files.video[0].path;
        await addSpeechToQueue({ videoPath: video_path, fileName: video_name, userId: user.id, ioUserId: null, router: 'profile' });
      }
    }

    await user.update({
      name: fullName,
      email,
      avatar: profile_path
    });

    if (profile) {
      await JobSeeker.update(
        {
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
          profileVisible: profileVisible,
          activeStatus: activeStatus,
          backgroundColor: color,
          layoutStyle: layout_style,
        },
        {
          where: { userId: userId },
        }
      );

    } else {
      await JobSeeker.create(
        {
          userId: userId,
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
          profileVisible: profileVisible,
          activeStatus: activeStatus,
          backgroundColor: color,
          layoutStyle: layout_style,
          videoAnalysis: vid,
        },
      );
    }

    const visibility = await VisibilitySetting.findOne({
      where: { userId: userId },
    });

    if (!visibility) {
      await VisibilitySetting.create({
        userId: userId,
        basicInfo: basic_information,
        videoIntro: video_introduction,
        skills: user_skills,
        education: education,
        experience: experience,
        // recommendations: recommendations,
      });

    } else {
      await VisibilitySetting.update(
        {
          basicInfo: basic_information || false,
          videoIntro: video_introduction || false,
          skills: user_skills || false,
          education: education || false,
          experience: experience || false,
          recommendations: recommendations || false,
        },
        {
          where: { userId: userId },
        }
      );
    }

    await JobseekerSkills.destroy({
      where: { userId: userId },
    });

    let skillSet = JSON.parse(skills);
    const skillsToInsert = skillSet.map((skill) => ({
      userId: userId,
      skillId: skill.id,
    }));

    await JobseekerSkills.bulkCreate(skillsToInsert, {
      ignoreDuplicates: true,
    });

    res.status(201).json({ success: true });
  } catch (error) {
    console.log(error)
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const query = await User.findByPk(req.user.id, {
      include: [
        { model: PersonalInformation },
        { model: ProfessionalInformation },
        { model: Education },
        { model: Experience },
        { model: Certification },
        { model: Skill },
      ]
    });

    const profileInfo = transformProfileInfo(query);
    let profile = await validateProfileInfo(profileInfo);
    let valid = profile.isValid;
    return res.status(200).json(valid);
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({ error: "Internal server error" });
  }
}

exports.getJobSeekerById = async (req, res) => {
  try {
    const data = await User.findOne({
      where: { role: "job_seeker", id: req.params.id },
      include: [
        {
          model: JobSeeker,
          include: [
            { model: Industry },
            { model: EducationLevel },
            { model: SkillLevel },
            { model: YearsOfExperience }
          ],
        },
        {
          model: VisibilitySetting,
        },
        {
          model: UserLinkedProfile,
          as: 'linkedProfile',
        },
        {
          model: JobseekerSkills,
          include: [
            {
              model: Skill,
            },
          ],
        },
      ],
    });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json({ msg: "Profile not found" });
  }
}

