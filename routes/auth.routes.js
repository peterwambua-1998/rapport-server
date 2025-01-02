// const express = require("express");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  registerJobseeker,
  logout,
  setNewPassword,
  verifyEmail, 
  getCurrentUser
} = require("../controllers/auth.controller");

const uploadImagesMiddleware = require("../middleware/jobseekerMiddleware");
const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get("/me", getCurrentUser);

router.get("/:role/linkedin/", (req, res, next) => {
  const { role } = req.params;
  const state = JSON.stringify({ role });
  passport.authenticate("linkedin", {
    state,
  })(req, res, next);
});

router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", { failWithError: true }),
  function (req, res) {
    const redirectUrl =
      req.user.role === "recruiter"
        ? "/recruiter/dashboard"
        : "/jobseeker/dashboard";
    res.redirect(`${process.env.FRONTEND_URL}${redirectUrl}`); 
  },
  function (err, req, res, next) {
    res.redirect(`${process.env.FRONTEND_URL}/`);
  }
);

router.post(
  "/login",
  passport.authenticate("local", {
    failWithError: true,
  }),
  function (req, res) { 
    res.status(201).json({ message: "Successfully logged in", user: req.user }); 
  },
  function (err, req, res, next) {
    res.status(401).json({ message: err });
  }
);

router.post("/register", register);
router.post("/jobseeker-register", uploadImagesMiddleware, registerJobseeker);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.put("/verify-email/:token", verifyEmail);
router.put("/set-password/:id/set", setNewPassword);
router.put("/change-password", changePassword);
router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.json({ user: req.user });
  });
});

module.exports = router;
