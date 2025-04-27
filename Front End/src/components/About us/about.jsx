import React from "react";
import yarden from "./assets/yarden.jpg";
const About = () => {
  return (
    <div className="main">
      <h1 class="about-us-h1"> יוצר האתר</h1>
      <p className="middle">
        ירדן הללי
        <img src={yarden} alt="yarden" />
      </p>
    </div>
  );
};
export default About;
