import React, { useState } from "react";
import "../CSS/Form.css";
import { useHistory, Link } from "react-router-dom";
import axios from "../axios";

const emailValidation = /(.+@)(gmail|yahoo)(\..+)/g;
const passwordVlidation = /(?=^.{8,}$)(.*[A-Z].*(0|[1-9]).*)/g;

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emptyError, setEmptyError] = useState("");

  const history = useHistory();

  const formValidation = () => {
    if (!email && !password) {
      setEmptyError("Field Can't be empty");
    } else {
      setEmptyError("");

      const credentials = {
        email: email,
        password: password,
      };

      axios.post("/api/login", credentials).then((res) => {
        if (res.data == "Successfully Authenticated") {
          history.push("/home");
        }
      });
    }
  };

  const onSubmitfunc = (e) => {
    e.preventDefault();
    formValidation();
  };

  return (
    <div className="form">
      <div className="form-box">
        <p style={{ marginLeft: "auto", marginRight: "auto", fontSize: 35 }}>
          Login Form
        </p>
        <form onSubmit={onSubmitfunc}>
          <div style={{ color: "red" }}>{emptyError}</div>
          <div>
            <input
              placeholder="Email"
              type="text"
              className="form-field"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              placeholder="Password"
              type="password"
              className="form-field"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br></br>
            <Link to="/signup">Click here to signup</Link>
          </div>

          <input className="btn" type="submit" value="Login" />
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
