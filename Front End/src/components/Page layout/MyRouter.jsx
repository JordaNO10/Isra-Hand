import React from "react";
import { Route, Routes } from "react-router-dom";
import Homepage from "../Page layout/homepage";
import About from "../About us/about";
import Contact from "../Contact us/contact";
import Footer from "../Page layout/Footer";
import Singlepage from "../Donations/singlePage";
import Header from "../Page layout/Header";
import Donation from "../Donations/donations";
import UserDashboard from "../userpage/dashboard";
import SignupPage from "../Sign up/signup";
import "./css/style.css";

const MyRouter = ({ onLogout }) => {
  // Accept onLogout as a prop
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/About" element={<About />} />
        <Route path="/Donations" element={<Donation />} />
        <Route path="/Donations/:id" element={<Singlepage />} />
        <Route path="/Signup" element={<SignupPage />} />
        <Route
          path="/dashboard"
          element={<UserDashboard onLogout={onLogout} />}
        />{" "}
        <Route path="/Contact" element={<Contact />} />
        <Route path="*" element={<h1 className="main">Not Found</h1>} />
      </Routes>
      <Footer />
    </>
  );
};

export default MyRouter;
