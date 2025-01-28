const { writeFile, unlink } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { processFile } = require('../services/resumeExtraction.service');
const { ProfessionalInformation, PersonalInformation, Education, Experience, Certification, Skill, User, JobSeekerStat } = require("../models");
const addSpeechToQueue = require('../services/speech.service');

const clientID = process.env.LINKEDIN_CLIENT_ID;
const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
const callbackURL = `${process.env.SERVER_URL}/auth/data-source/linkedin`;

exports.processFile = async (req, res) => {
    try {
        let processResult = {
            AboutMe: null,
            Location: null,
            Industry: null,
            YearsofExperience: null,
            CurrentRole: null,
            Company: null,
            LinkedInProfileUrl: null,
            PortfolioUrl: null,
            Education: [],
            WorkExperience: [],
            Certifications: [],
            Skills: [],
        };
        const tempFilePath = join(tmpdir(), `temp-${Date.now()}.pdf`);
        await writeFile(tempFilePath, req.file.buffer);
        const fileInfo = {
            originalName: req.file.originalname,
            size: req.file.size,
            mimeType: req.file.mimetype,
            // Add any processing results here
        };

        processResult = await processFile(tempFilePath, fileInfo.mimeType)

        await unlink(tempFilePath);

        res.json({ status: true, result: processResult })
    } catch (error) {
        console.log(error);
        res.json({ status: false }).status(400)
    }
}

exports.storeProfessionalInfo = async (req, res) => {
    try {
        const {
            professionalTitle,
            yearsOfExperience,
            currentRole,
            company,
            linkedIn,
            portfolio,
            github
        } = req.body
        const userId = req.user.id;
        // check if record exists
        const infoExists = await ProfessionalInformation.findOne({ where: { userId: userId } })
        if (infoExists) {
            const store = await infoExists.update({
                professionalTitle,
                yearsOfExperience,
                currentRole,
                company,
                linkedIn,
                portfolio,
                github,
            })

            return res.status(200).json({
                status: "success",
                info: store
            });
        }

        const store = await ProfessionalInformation.create({
            userId,
            professionalTitle,
            yearsOfExperience,
            currentRole,
            company,
            linkedIn,
            portfolio,
            github,
        })

        return res.status(201).json({
            status: "success",
            info: store
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
}

exports.storePersonalInfo = async (req, res) => {
    try {
        const {
            about,
            location,
            industry,
        } = req.body;

        const files = req.files;

        let video_path, video_name;

        const userId = req.user.id;

        const user = await User.findByPk(userId);

        let vid = {
            summary: '',
            highlights: [],
            recommendations: [],
            pastExperience: [],
            softSkills: [],
            technicalSkills: [],
            careerGoals: []
        }

        if (files) {
            if (files.profilePicture) {
                profile_path = files.profilePicture ? files.profilePicture[0].path : "";

                await user.update({ avatar: profile_path })
            }

            if (files.video) {
                video_name = files.video[0].filename;
                video_path = files.video[0].path;

                await addSpeechToQueue({ videoPath: video_path, fileName: video_name, userId, router: 'register' });

                await user.update({ video_path: video_path })
            }
        }

        const infoExists = await PersonalInformation.findOne({ where: { userId: userId } });

        if (infoExists) {
            const pInfo = await infoExists.update({
                about,
                location,
                industry,
                videoAnalysis: vid,
            });

            return res.status(201).json({
                status: "success",
                info: pInfo
            });
        }

        const pInfo = await PersonalInformation.create({
            about,
            location,
            industry,
            videoAnalysis: vid,
            userId
        });

        return res.status(201).json({
            status: "success",
            info: pInfo
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
}

exports.storeEducation = async (req, res) => {
    try {
        const { educationData } = req.body;

        const userId = req.user.id;

        await Education.destroy({ where: { userId: userId } });

        educationData.forEach(async ({ school, degree, major, startDate, endDate }) => {
            await Education.create({
                school,
                degree,
                major,
                startDate,
                endDate,
                userId
            });
        });

        return res.status(201).json({
            status: "success",
            educationData
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
}

exports.storeExperience = async (req, res) => {
    try {
        const { experienceData } = req.body;

        const userId = req.user.id;

        await Experience.destroy({ where: { userId: userId } });

        experienceData.forEach(async ({ position, employer, description, startDate, endDate, currentlyWorking }) => {
            await Experience.create({
                position,
                employer,
                description,
                startDate,
                endDate,
                currentlyWorking,
                userId: req.user.id
            });
        });

        return res.status(201).json({
            status: "success",
            experienceData
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
}

exports.storeCerts = async (req, res) => {
    try {
        const { certsData } = req.body;

        const userId = req.user.id;

        await Certification.destroy({ where: { userId: userId } });

        certsData.forEach(async ({ name, organization }) => {
            await Certification.create({
                name,
                organization,
                userId
            });
        });

        return res.status(201).json({
            status: "success",
            certsData
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
}

exports.storeSkills = async (req, res) => {
    try {
        const { skillData } = req.body;

        const userId = req.user.id;

        await Skill.destroy({ where: { userId: userId } });

        skillData.forEach(async ({ name, proficiency }) => {
            await Skill.create({
                name,
                proficiency,
                userId
            });
        });

        return res.status(201).json({
            status: true,
            skillData
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
        });
    }
}

exports.getJobSeekerInfo = async (req, res) => {
    try {
        const query = await User.findByPk(req.user.id, {
            include: [
                { model: PersonalInformation },
                { model: ProfessionalInformation },
                { model: Education },
                { model: Experience },
                { model: Certification },
                { model: Skill },
                { model: JobSeekerStat }
            ]
        });

        const profileInfo = transformProfileInfo(query);

        return res.json({
            status: true,
            profileInfo
        });
    } catch (error) {
        console.log(error)
        res.json({ status: false, message: error.message, }).status(400)
    }
}


exports.callBackLinkedInd = async (req, res) => {
    try {

        const { code, state } = req.query;

        // Exchange authorization code for access token
        const tokenResponse = await axios.post(
            'https://www.linkedin.com/oauth/v2/accessToken',
            null,
            {
                params: {
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: callbackURL,
                    client_id: clientID,
                    client_secret: clientSecret
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const accessToken = tokenResponse.data.access_token;

        // Fetch user profile
        const profileResponse = await axios.get('https://api.linkedin.com/v2/me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'cache-control': 'no-cache',
                'X-Restli-Protocol-Version': '2.0.0'
            }
        });

        // Fetch user email
        const emailResponse = await axios.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'cache-control': 'no-cache',
                'X-Restli-Protocol-Version': '2.0.0'
            }
        });

        // Combine profile and email data
        const profileData = {
            displayName: `${profileResponse.data.firstName} ${profileResponse.data.lastName}`,
            email: emailResponse.data.elements[0]['handle~'].emailAddress,
            profilePicture: profileResponse.data.profilePicture?.displayImage || null
        };

        res.json(profileData);

    } catch (error) {
        console.error('LinkedIn API Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to retrieve LinkedIn profile' });
    }
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
}

function transformProfileInfo(profileInfo) {
    return {
        Name: profileInfo.fName + ' ' + profileInfo.lName,
        Email: profileInfo.email,
        AboutMe: profileInfo.PersonalInformation?.about || '',
        ProfessionalTitle: profileInfo.ProfessionalInformation?.professionalTitle || '',
        Location: profileInfo.PersonalInformation?.location || '',
        Industry: profileInfo.PersonalInformation?.industry || '',
        videoUrl: profileInfo.video_path || '',
        videoUploadDate: profileInfo.updatedAt || '',
        profilePhotoUrl: profileInfo.avatar || '',
        YearsofExperience: profileInfo.ProfessionalInformation?.yearsOfExperience || 0,
        CurrentRole: profileInfo.ProfessionalInformation?.currentRole || '',
        Company: profileInfo.ProfessionalInformation?.company || '',
        LinkedInProfileUrl: profileInfo.ProfessionalInformation?.linkedIn || null,
        PortfolioUrl: profileInfo.ProfessionalInformation?.portfolio || null,
        GithubUrl: profileInfo.ProfessionalInformation?.github || null,
        videoAnalysis: profileInfo.PersonalInformation?.videoAnalysis,
        stats: {
            profileViews: profileInfo.JobSeekerStat?.profileViews || 0,
            searchAppearance: profileInfo.JobSeekerStat?.searchAppearance || 0,
            interviewsCompleted: profileInfo.JobSeekerStat?.interviewsCompleted || 0,
            challengesCompleted: profileInfo.JobSeekerStat?.challengesCompleted || 0,
            daysOnPlatform: profileInfo.JobSeekerStat?.daysOnPlatform || 0
        },
        Education: (profileInfo.Education || []).map(edu => ({
            school: edu.school,
            degree: edu.degree,
            major: edu.major,
            startDate: edu.startDate ? formatDate(edu.startDate) : '',
            endDate: edu.endDate ? formatDate(edu.endDate) : ''
        })),

        WorkExperience: (profileInfo.Experiences || []).map(exp => ({
            position: exp.position,
            employer: exp.employer,
            description: exp.description,
            startDate: exp.startDate ? formatDate(exp.startDate) : '',
            endDate: exp.endDate ? formatDate(exp.endDate) : '',
            currentlyWorking: exp.currentlyWorking
        })),

        Certifications: (profileInfo.Certifications || []).map(cert => ({
            name: cert.name,
            organization: cert.organization
        })),

        Skills: (profileInfo.Skills || []).map(skill => ({
            name: skill.name,
            proficiency: skill.proficiency,
            updatedAt: skill.updatedAt
        }))
    };
}