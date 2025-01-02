const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project.controller");


router.post("/", projectController.createProject);
router.get("/", projectController.getProjects);
router.get("/:id", projectController.getProjectById);
router.put("/:id", projectController.updateProject);
router.post("/status", projectController.changeProjectStatus);
router.delete("/:id", projectController.deleteProject);
router.get("/jobseeker/projects", projectController.getJobseekerProjects);
router.post('/notes/store', projectController.storeProjectNote);
router.post('/candidates/:candidateId/notes', projectController.addNote);
router.post('/candidates/:candidateId/status', projectController.changeStatus);
router.post('/candidates/:candidateId/status', projectController.changeStatus);

module.exports = router;
