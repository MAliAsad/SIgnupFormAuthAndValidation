import React, { useState } from "react";
import "../CSS/Form.css";
import axios from "../axios";

import { useHistory, Link } from "react-router-dom";

const emailValidation = /(.+@)(gmail|yahoo)(\..+)/g;
const usernameValidation = /^(.+){8,}$/g;
const passwordValidation = /(?=^.{8,}$)(.*[A-Z].*(0|[1-9]).*)/g;

const SignupForm = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [emptyFieldError, setEmptyFieldError] = useState("");

  const history = useHistory();

  const onUsernameChange = (e) => {
    setUsername(e.target.value);

    if (!username.match(usernameValidation)) {
      setUsernameError("Name is too short!");
    } else {
      return setUsernameError("");
    }
  };

  const onEmailChange = (e) => {
    setEmail(e.target.value);

    if (!email.match(emailValidation)) {
      setEmailError("Invalid Email!");
    } else {
      return setEmailError("");
    }
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value);

    if (!password.match(passwordValidation)) {
      setPasswordError(
        "Password must have atleast one capital letter and one number"
      );
    } else {
      return setPasswordError("");
    }
  };

  const onSubmitfunc = (e) => {
    e.preventDefault();

    if (!firstname || !lastname || !username || !email || !password) {
      setEmptyFieldError("All fields are required!");
    } else {
      setEmptyFieldError("");
      if (!usernameError && !emailError && !passwordError) {
        const user = {
          firstname: firstname,
          lastname: lastname,
          username: username,
          email: email,
          password: password,
        };

        axios
          .post("/api/user", user)
          .then((data) => console.log(data))
          .then(() => history.push("/login"));
      }
    }
  };

  return (
    <div className="form">
      <div className="form-box">
        <p
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            fontSize: 35,
            color: "rgb(238, 236, 236)",
          }}
        >
          Signup Form
        </p>
        <form onSubmit={onSubmitfunc}>
          <div style={{ color: "red" }}>
            {emptyFieldError && emptyFieldError}
          </div>
          <div>
            <input
              type="text"
              className="form-field"
              name="firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="form-field"
              placeholder="Firstname"
            />
          </div>

          <div>
            <input
              type="text"
              className="form-field"
              name="Lastname"
              value={lastname}
              onChange={(e) => setlastname(e.target.value)}
              className="form-field"
              placeholder="Lastname"
            />
          </div>

          <div>
            <input
              type="text"
              className="form-field"
              name="username"
              value={username}
              onChange={onUsernameChange}
              className="form-field"
              placeholder="Username"
            />
          </div>
          <div style={{ color: "red" }}>{usernameError}</div>

          <div>
            <input
              placeholder="Email"
              type="text"
              className="form-field"
              name="email"
              value={email}
              onChange={onEmailChange}
            />
          </div>
          <div style={{ color: "red" }}>{emailError}</div>

          <div>
            <input
              placeholder="Password"
              type="password"
              className="form-field"
              name="password"
              value={password}
              onChange={onPasswordChange}
            />
          </div>
          <div style={{ color: "red" }}>{passwordError}</div>
          <div>
            <Link to="/login">Click here to Login</Link>
          </div>

          <input className="btn" type="submit" value="Signup" />
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
