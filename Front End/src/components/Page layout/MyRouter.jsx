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
import Donationadd from "../Donations/Donationadd";
import SignupPage from "../Sign up/signup";
import AdminPage from "../userpage/adminpage";
import Cookies from "js-cookie";
import PrivateRoute from "../Sign up/PrivateRoute";

const userRole = Cookies.get("userRole");
const MyRouter = ({ onLogout }) => {
  // Accept onLogout as a prop
  return (
    <>
      <Header onLogout={onLogout} />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/About" element={<About />} />
        <Route path="/Signup" element={<SignupPage />} />
        <Route path="/Donations" element={<Donation />} />

        {/* Protected routes for Admin and Donator */}
        <Route
          path="/Donationadd"
          element={
            <PrivateRoute element={<Donationadd />} roles={["1", " 2"]} />
          }
        />

        <Route
          path="/Donations/:id"
          element={
            <PrivateRoute element={<Singlepage />} roles={["1", " 2"]} />
          }
        />

        <Route
          path="/Admin"
          element={<PrivateRoute element={<AdminPage />} roles={["1"]} />}
        />

        <Route
          path="/dashboard"
          element={<UserDashboard onLogout={onLogout} />}
        />
        <Route path="/Contact" element={<Contact />} />
        <Route path="*" element={<h1 className="main">Not Found</h1>} />
      </Routes>
      <Footer />
    </>
  );
};

export default MyRouter;
