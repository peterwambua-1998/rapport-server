const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const projectRoutes = require("./project.routes");
const featureRoutes = require("./feature.routes");
const notificationRoutes = require("./notification.routes");
const skillLevelRoutes = require("./skillLevel.routes");
const yearsOfExperienceRoutes = require("./yearsOfExperience.routes");
const industryRoutes = require("./industry.routes");
const educationLevelRoutes = require("./educationLevel.routes");
const skillRoutes = require("./skill.routes");
const userRoutes = require("./user.routes");
const planRoutes = require("./plan.routes");
const subscriptionRoutes = require("./subscription.routes");
const companyRoutes = require("./company.routes");
const countryRoutes = require("./country.routes");
const teamRoutes = require("./team.routes");
const messageRoutes = require("./message.routes");
const interviewRoutes = require("./interview.routes");
const listing = require("./listing.routes");
const schedule = require('./schedule.routes');
const emailConfiguration = require('./emailConfiguration.routes');
const emailTemplate = require('./emailTemplate.routes');
const profileVisibility = require('./profileVisibility.routes');

router.use("/skill-levels", skillLevelRoutes);
router.use("/years-of-experience", yearsOfExperienceRoutes);
router.use("/industries", industryRoutes);
router.use("/education-levels", educationLevelRoutes); 
router.use("/projects", projectRoutes);
router.use("/features", featureRoutes);
router.use("/plans", planRoutes);
router.use("/notifications", notificationRoutes); 
router.use("/skills", skillRoutes);
router.use("/users", userRoutes); 
router.use("/teams", teamRoutes);
router.use("/auth", authRoutes);
router.use("/subscriptions", subscriptionRoutes);
router.use("/companies", companyRoutes);
router.use("/countries", countryRoutes);
router.use("/messages", messageRoutes);
router.use("/interviews", interviewRoutes);
router.use("/listing", listing);
router.use("/schedule", schedule);
router.use("/email-configurations", emailConfiguration);
router.use("/email-templates", emailTemplate);
router.use("/profile-visibilities", profileVisibility);


router.get("/", (req, res) => {
  res.send("Hello World");
});

module.exports = router;
