import React from "react";
import { Link } from "react-router-dom";
import "../CSS/LandingPage.css";

const LandingPage = () => {
  return (
    <div className="container">
      <Link to="/login">
        <button className="btnn">Login</button>
      </Link>
      <Link to="/signup">
        <button className="btnn">Signup</button>
      </Link>
    </div>
  );
};

export default LandingPage;
