var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const passport = require("./config/passport");
const session = require("express-session");
const cors = require("cors");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const { sequelize } = require("./models");

const appRoutes = require("./routes");

var app = express();
const sessionStore = new SequelizeStore({
  db: sequelize,
});
sessionStore.sync();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.SERVER_URL],
    credentials: true,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    // cookie: { secure: false } // set to true for https ie production
  })
);



// Passport middleware
app.use(passport.initialize());
// app.use(passport.session());
app.use(passport.authenticate("session"));


app.use("/api", appRoutes);

module.exports = app;
