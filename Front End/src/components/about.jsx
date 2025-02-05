import React from "react";
import "../css/style.css";
import yarden from "../assets/yarden.jpg";
const About = () => {
  return (
    <div className="main">
      <h1 class="about-us-h1"> The Team Behind The Project</h1>
      <p className="middle">
        Yarden Halely <br />
        <img src={yarden} alt="yarden" />
      </p>
    </div>
  );
};
export default About;
