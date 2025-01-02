const { Schedule, Conversation, Message, Project } = require('../models')

exports.create = async (req, res) => {
    try {
        const { ProjectId, JobSeekerId, InterviewDate, Note } = req.body;
        const RecruiterId = req.user.id;
        console.log('one ======');
        console.log(JobSeekerId, ProjectId, RecruiterId);


        const schedule = await Schedule.create({
            ProjectId,
            JobSeekerId: JobSeekerId,
            RecruiterId: RecruiterId,
            InterviewDate,
            Note,
            Status: 'pending'
        });

        const conversation = await Conversation.create({
            jobSeekerId: JobSeekerId,
            recruiterId: RecruiterId,
            ProjectId,
            ScheduleId: schedule.id,
            created_at: new Date(),
        });

        const projects = await Project.findOne({
            where: {
                id: ProjectId,
            },
        })

        const newDate = new Date(InterviewDate).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })

        const message = `You have been scheduled for an interview on date: ${newDate} for project: ${projects.name}.`;

        const newMessage = await Message.create({
            conversationId: conversation.id,
            isUser: RecruiterId,
            message,
            created_at: new Date(),
        });


        return res.json({ msg: 'success' });
    } catch (error) {
        console.log(error)
        return res.json(error).status(500)
    }
}

exports.getSchedules = async (req, res) => {
    try {
        const { projectId } = req.body;
        const schedules = await Schedule.findAll({
            where: { ProjectId: projectId }
        })
        return res.json(schedules);
    } catch (error) {
        return res.json(error).status(500)
    }
}

exports.updateSchedule = async (req, res) => {
    try {
        const { status, id } = req.body;

        const schedules = await Schedule.findOne({ where: { id: id } });

        if (!schedules) {
            //pending,  accepted, reject, canceled 
        return res.json(error).status(500)
        }

        const response = await Schedule.update({
            Status: status,
            created_at: new Date(),
        }, {
            where: { id: id }
        });

        // Add status change reason
        return res.json({ success: true });
    } catch (error) {
        return res.json(error).status(500)
    }
}

exports.getAllSchedules = async (req, res) => {
    try {
        let userId = req.user.id;
        if (req.user.role === 'recruiter') {
            const schedule = await Schedule.findAll({
                where: {RecruiterId: userId},
                include: {model: Project}
            });
            return res.json(schedule);
        }

        const schedule = await Schedule.findAll({
            where: {JobSeekerId: userId},
            include: {model: Project}
        });

        return res.json(schedule);
    } catch (error) {
        return res.json(error).status(500)
    }
}