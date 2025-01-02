const express = require("express");
const userController = require("../controllers/user.controller");
const recruiterProfileMiddleware = require("../middleware/recruiterProfileMiddleware");
const uploadImagesMiddleware = require("../middleware/jobseekerMiddleware")


const router = express.Router();
router.get("/admins", userController.getAdmins);
router.get("/recruiters", userController.getRecruiters);
router.get("/jobseekers", userController.getJobSeekers);

router.get("/profile", userController.profile);

router.put(
  "/profile",
  recruiterProfileMiddleware,
  userController.updateProfile
);

router.put(
  "/admin-profile",
  recruiterProfileMiddleware,
  userController.updateAdminProfile
);

router.put(
  "/seekerprofile",
  uploadImagesMiddleware,
  userController.updateSeekerProfile
);

router.put("/:id/status", userController.updateStatus);
router.get("/:id/jobseeker", userController.getJobSeekerById);
router.get("/ms", userController.getProfile);
//
module.exports = router;
