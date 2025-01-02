require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("./config/passport");
const bodyParser = require("body-parser");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const { sequelize } = require("./models");
const cors = require("cors");

const sessionStore = new SequelizeStore({
  db: sequelize,
});

sessionStore.sync();
const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.SERVER_URL],
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      secure: process.env.NODE_ENV === "production",
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", require("./routes")); 

// Test route
app.get("/", (req, res) => {
  res.send("Welcome to the app!");
});

module.exports = app;
