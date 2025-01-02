const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
var LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const bcrypt = require("bcryptjs");
const { User, UserLinkedProfile, JobSeeker } = require("../models");

passport.use(
  new LocalStrategy(
    { usernameField: "email", passReqToCallback: true },
    async (req, email, password, done) => {
      try {
        const user = await User.findOne({
          where: { email, role: req.body.role },
          attributes: ['id', 'name', 'email', 'role', 'avatar', 'password', 'isVerified'],
        });

        if (!user) {
          return done({ message: "Incorrect email or password.", needsPasswordSetup: false }, null);
        }

        if (!user.isVerified && user.role == "job_seeker") {
          const plainUser = user.toJSON();
          delete plainUser.password;
          delete plainUser.isVerified;
          return done({ message: "Please set your password to complete your registration.", needsPasswordSetup: true, user: plainUser }, null);
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return done({ message: "Incorrect email or password.", needsPasswordSetup: false }, null);
        }
        
        const plainUser = user.toJSON();
        delete plainUser.password;
        delete plainUser.isVerified; 
        return done(null, plainUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

const createLinkedInprofile = async (userId, profile) => {
  const { id, email, givenName, familyName, displayName, picture } = profile;
  const { locale, email_verified } = profile._json;

  const userProfile = await UserLinkedProfile.create({
    userId,
    linkedinID: id,
    email_verified: email_verified,
    name: displayName,
    given_name: givenName,
    family_name: familyName,
    email: email,
    country: locale.country,
    language: locale.language,
    picture,
  });

  return userProfile;
};

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
      console.log(profile)
      req.session.accessToken = accessToken;
      process.nextTick(async () => {
        const { id, email, displayName } = profile;
        const { state } = req.query;
        const { role } = JSON.parse(state);

        let user = await User.findOne({ where: { email: email } });
        if (!user) {
          user = await User.create({
            name: displayName,
            email,
            role,
            password: "password123",
            linkedinId: id,
            linkedinIdLogin: true,
          });
          await createLinkedInprofile(user.id, profile);
        } else {
          user_role = user.role;
          if (user.role == role) {
            const linkedinProfile = await UserLinkedProfile.findOne({
              where: { email: email },
            });
            if (!linkedinProfile) {
              await createLinkedInprofile(user.id, profile);
            }
          }
        }

        return done(null, user);
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

module.exports = passport;