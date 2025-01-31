const express = require("express");
const userController = require("../controllers/user.controller");
const { daysOnPlatformStore, challengesCompletedStore, interviewsCompletedStore, searchAppearanceStore, profileViewsStore, getJobSeekerStats } = require("../controllers/jobSeekerStats.controller");
const recruiterProfileMiddleware = require("../middleware/recruiterProfileMiddleware");
const uploadImagesMiddleware = require("../middleware/jobseekerMiddleware")
const { getPreferences, storePreferences, storeFeedback } = require('../controllers/dataSource.controller');


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


// job seeker stats routes
router.post("/stats/days-on-platform", daysOnPlatformStore);
router.post("/stats/challenges", challengesCompletedStore);
router.post("/stats/interviews", interviewsCompletedStore);
router.post("/stats/search-appearance", searchAppearanceStore);
router.post("/stats/profile-views", profileViewsStore);
router.get("/stats/job-seeker/get", getJobSeekerStats);

// job seeker preferences routes

router.get('/get/preferences', getPreferences);
router.post('/store/preferences', storePreferences);
router.post('/job-seeker/feedback/store', storeFeedback);

module.exports = router;
