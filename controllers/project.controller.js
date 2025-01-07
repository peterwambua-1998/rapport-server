const { Project, Industry, Note, MatchedCandidateNote, MatchedCandidate, JobSeeker, User, Skill, Schedule, YearsOfExperience, EducationLevel, SkillLevel, JobseekerSkills } = require("../models");
const { matchCandidates } = require("../services/projectMatching");

// Create a new project
const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const candidates = await User.findAll({
      where: { role: "job_seeker" },
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
          ]
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
    const matchedCandidates = await matchCandidates(candidates, description)

    const project = await Project.create({
      userId: req.user.id,
      name,
      description,
      status: false,
    });

   
    const storeMatched = await MatchedCandidate.bulkCreate(matchedCandidates.candidates.map((candidate) => ({
      ProjectId: project.id,
      UserId: candidate.id,
      Status: "Screening",
    })));

    return res
      .status(201)
      .json({ message: "Project created successfully", project: project, matchedCandidates: storeMatched });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error creating project", error: error.message });
  }
};

// Get all projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      where: {
        userId: req.user.id,
      },
      include: [
        {
          model: Note,
        },
        {
          model: MatchedCandidate,
          include: [
            { 
              model: User,
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
                  ]
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
            },
            {
              model: MatchedCandidateNote,
              order: [["createdAt", "DESC"]],
            }
          ]
        },
      ],
    });

    return res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error fetching projects", error: error.message });
  }
};

// Get a single project by ID
const getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findOne({ where: { id }, include: [{ model: Schedule }] });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.status(200).json(project);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error fetching project", error: error.message });
  }
};

// Update project details
const updateProject = async (req, res) => {
  console.log('updateProject===')

  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const project = await Project.findOne({ where: { id } });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    project.name = name || project.name;
    project.description = description || project.description;
    await project.save();
    return res
      .status(200)
      .json({ message: "Project updated successfully", project });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error updating project", error: error.message });
  }
};

// Change project status
const changeProjectStatus = async (req, res) => {

  const { projectId, candidateFound, rating, searchDuration, feedback } = req.body; // expect status like 'active', 'inactive', 'completed'
  try {
    const project = await Project.findOne({ where: { id: projectId } });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    project.status = true;
    project.foundCandidate = candidateFound;
    project.projectSearchDuration = searchDuration;
    project.rating = rating;
    project.feedback = feedback;
    await project.save();
    return res
      .status(200)
      .json({ message: "Project ended", project });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error updating project status", error: error.message });
  }
};

// Delete a project
const deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findOne({ where: { id } });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    await project.destroy();
    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error deleting project", error: error.message });
  }
};


// Get all projects
const getJobseekerProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [
        {
          model: Schedule,
          where: {
            JobSeekerId: req.user.id,
          },
        }, {
          model: User,
        }
      ],
    });

    return res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error fetching projects", error: error.message });
  }
};


const addNote = async (req, res) => {
  try {
    const matchedCandidate = await MatchedCandidate.findOne({
      where: { UserId: req.params.candidateId,  ProjectId: req.body.projectId}
    });

    if (!matchedCandidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    const note = await MatchedCandidateNote.create({
      MatchedCandidateId: matchedCandidate.id,
      Note: req.body.note
    });

    res.status(201).json(note);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

const changeStatus = async (req, res) => {
  try {
    const matchedCandidate = await MatchedCandidate.findOne({
      where: { UserId: req.params.candidateId,  ProjectId: req.body.projectId}
    });

    if (!matchedCandidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    matchedCandidate.Status = req.body.newStatus;

    matchedCandidate.save();

    res.status(201).json({ message: "success" });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const note = await MatchedCandidateNote.update(
      { Note: req.body.note },
      { 
        where: { id: req.params.noteId },
        returning: true
      }
    );
    res.json(note[1][0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const storeProjectNote = async (req, res) => {
  try {
    const project = await Project.findOne({ where: { id:  req.body.projectId} });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const note = await Note.create({projectId: project.id, noteContent: req.body.note})
    res.json({message: 'noted stored', note});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  changeProjectStatus,
  deleteProject,
  getJobseekerProjects,
  addNote,
  updateNote,
  changeStatus,
  storeProjectNote
};
