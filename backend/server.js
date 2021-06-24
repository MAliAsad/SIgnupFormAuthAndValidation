const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const user = require("./models/user");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const url =
  "mongodb+srv://admin:admin@cluster0.bj83a.mongodb.net/formDB?retryWrites=true&w=majority";
mongoose.connect(url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => console.log("connected to mongoDB"));

app.get("/", (req, res) => {
  res.status(200).send("Server is running Successfully");
});

app.get("/api/user", (req, res) => {
  user.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status("200").send(data);
    }
  });
});

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

app.listen(port, () => console.log("Server is running on port: " + port));
