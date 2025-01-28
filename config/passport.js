const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
var LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const bcrypt = require("bcryptjs");
const { User, RecruiterProfile, JobSeekerStat } = require("../models");
const { default: axios } = require("axios");
const path = require('path');
const fs = require('fs');

passport.use(
  new LocalStrategy(
    { usernameField: "email", passReqToCallback: true },
    async (req, email, password, done) => {
      try {
        const user = await User.findOne({
          where: { email, role: req.body.role },
          attributes: ['id', 'fName', 'lName', 'email', 'role', 'avatar', 'isVerified', 'password', 'linkedinId'],
        });

        if (!user) {
          return done({ message: "Incorrect email or password.", needsPasswordSetup: false }, null);
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return done({ message: "Incorrect email or password.", needsPasswordSetup: false }, null);
        }

        const stats = await JobSeekerStat.findOne({where:{ userId: user.id }});
        console.log(stats);
        
        if (stats) {
          let d = stats.daysOnPlatform ?? 0;
          await stats.update({ daysOnPlatform: d + 1 });
        }

        const plainUser = {
          id: user.id,
          username: user.fName,
          email: user.email,
          role: user.role,
          linkedIn: user.linkedinId ? true : false
        };

        return done(null, plainUser);
      } catch (err) {
        
        return done(err);
      }
    }
  )
);

passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: process.env.LINKEDIN_REDIRECT_URI,
      scope: ["profile", "email", "openid"],
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {

      process.nextTick(async () => {
        try {
          const { id, email } = profile;
          const { state } = req.query;
          const { role } = JSON.parse(state);
          const photoUrl = profile.picture ? profile.picture : null;
          const { locale, given_name, family_name } = profile._json;

          let photoPath = await linkedInPictureDownload(photoUrl);

          let user = await User.findOne({ where: { email: email } });
          if (!user) {
            user = await User.create({
              fName: given_name,
              lName: family_name,
              email,
              role,
              linkedinId: id,
              linkedinIdLogin: true,
              avatar: photoPath,
              isVerified: true,
            });

            if (role == "job_seeker") {
              await JobSeekerStat.create({
                userId: user.id,
                profileViews: 0,
                searchAppearance: 0,
                interviewsCompleted: 0,
                challengesCompleted: 0,
                daysOnPlatform: 1
              });
            }

            if (role === "recruiter") {
              await RecruiterProfile.create({
                user_id: user.id,
                first_name: given_name,
                last_name: family_name,
                country: locale.country,
              });
            }
          } else {
            const stats = await JobSeekerStat.findOne({where: { userId: user.id }});
            if (stats) {
              let d = stats.daysOnPlatform ?? 0;
              await stats.update({ daysOnPlatform: d  + 1 });
            }
          }

          let u = {
            id: user.id,
            username: user.fName,
            email: user.email,
            role: user.role,
            linkedIn: user.linkedinId ? true : false
          }
          return done(null, u);
        } catch (err) {
          console.log(err)
          return done(err);
        }

      });
    }
  )
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      linkedIn: user.linkedIn
    });
  });
});

// gets user from cookie
passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    try {
      return cb(null, user);
    } catch (err) {
      done(err);
    }
  });
});

const getFileExtension = (url, contentType) => {
  // First try to get extension from URL
  const urlExtension = path.extname(url);
  if (urlExtension) return urlExtension;

  // If no extension in URL, derive from content type
  const mimeToExt = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif'
  };

  return mimeToExt[contentType] || '.jpg'; // Default to .jpg if unknown
};

module.exports = passport;

async function linkedInPictureDownload(photoUrl) {
  let photoPath = null;

  if (photoUrl) {
    // Download LinkedIn profile photo
    const response = await axios({
      url: photoUrl,
      method: 'GET',
      responseType: 'arraybuffer',
      headers: {
        'Accept': 'image/*'
      }
    });

    // Get the content type from the response
    const contentType = response.headers['content-type'];

    // Get proper file extension
    const fileExtension = getFileExtension(photoUrl, contentType);

    // Create a Buffer from the image data
    const buffer = Buffer.from(response.data, 'binary');

    // Generate filename with proper extension
    const filename = `profilePicture-${Date.now()}${fileExtension}`;
    const filePath = path.join('uploads/images', filename);

    // Save the file
    await fs.promises.writeFile(filePath, buffer);

    photoPath = filePath;
  }
  return photoPath;
}
