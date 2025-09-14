import React, { useContext } from "react";
import "../styles/Hero.css";
import heroImage from "../assets/img1.png";
import { Context } from "../pages/Context.jsx";

const Hero = () => {
  const { user } = useContext(Context);
  return (
    <>
      <div className="hero-section">
        {/* <img src={heroImage} alt="hero-image" /> */}
        <h4>Hello, {user ? user.name : "Developer"}</h4>
        <h1>Welcome to MERN Full Authentication</h1>
        <p>
          This project showcases a complete authentication system built with the
          MERN stack, including OTP verification using Twilio and secure email
          delivery with Nodemailer.
        </p>
      </div>
    </>
  );
};

export default Hero;
