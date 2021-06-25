const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const session = require("express-session");

const user = require("./models/user");

// Initializing app and port

const app = express();
const port = process.env.PORT || 5000;

// Middlewares

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(
  session({
    secret: "secretCode",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser("secretCode"));

app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);

// Conecting with DB

const url =
  "mongodb+srv://admin:admin@cluster0.bj83a.mongodb.net/formDB?retryWrites=true&w=majority";
mongoose.connect(url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => console.log("connected to mongoDB"));

// localhost frontend

app.get("/", (req, res) => {
  res.status(200).send("Server is running Successfully");
});

// Getting user data from db

app.get("/api/user", (req, res) => {
  user.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status("200").send(data);
    }
  });
});

// Posting data to user

app.post(
  "/api/user",
  [
    check("firstname", "Firstname Can't be empty").exists(),
    check("firstname", "Firstname Can't be empty").exists(),
    check("username", "Username is too short").exists().isLength({ min: 8 }),
    check("email", "email is invalid").isEmail().normalizeEmail(),
    check("password", "Password is not strong enough").matches(
      /(?=^.{8,}$)(.*[A-Z].*(0|[1-9]).*)/g
    ),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).jsonp(errors.array);
    } else {
      const hashPassword = bcrypt.hashSync(req.body.password, 10);

      const userData = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        password: hashPassword,
      };
      user.create(userData, (err, data) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status("201").send(data);
        }
      });
    }
  }
);

// Route to login take data from frontend

app.post("/api/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;

    if (!user) {
      res.send("Invalid email or password");
    } else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send("Successfully Authenticated");
      });
    }
  })(req, res, next);
});

app.listen(port, () => console.log("Server is running on port: " + port));
