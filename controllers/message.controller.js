const { Message, Conversation, User, Project, Schedule, RecruiterProfile, JobSeeker } = require("../models");

exports.startConversation = async (req, res) => {
  try {
    
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.create = async (req, res) => {
  try {
    const { conversationId, message } = req.body;

    let conversation = await Conversation.findByPk(conversationId);

    if (conversation) {
      const newMessage = await Message.create({
        conversationId: conversation.id,
        isUser: req.user.id,
        message,
        created_at: new Date(),
      });

      return res.status(201).json(newMessage);
    }

    return res.status(500).json({ error: 'peter' });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message });
  }
};

exports.getConvesations = async (req, res) => {
  try {
    const { role, id } = req.user;
    let conversations = [];
    if (role == "job_seeker") {
      conversations = await Conversation.findAll({
        where: { jobSeekerId: req.user.id },
        order: [["createdAt", "ASC"]],
        include: [
          { model: User, as: 'recruiter', include: [{ model: RecruiterProfile }] },
          { model: Project },
          { model: Message },
          { model: Schedule }
        ],
      });


    } else if (role == 'recruiter') {
      conversations = await Conversation.findAll({
        where: { recruiterId: req.user.id, },
        order: [["createdAt", "ASC"]],
        include: [{ model: User, as: 'jobSeeker',include: [{ model: JobSeeker }] }, { model: Project }, { model: Message }],
      });
    }

    return res.status(200).json(conversations);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.findAll({
      where: { conversationId },
      order: [["created_at", "ASC"]],
    });

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { ProjectId } = req.params;

    const schedule = await Schedule.findOne({
      where: { ProjectId: ProjectId, JobSeekerId: req.user.id }
    })

    if (schedule) {
      schedule.status = true;
      schedule.save()
      return res.status(200).json(true);
    }
    return res.status(200).json(true);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
