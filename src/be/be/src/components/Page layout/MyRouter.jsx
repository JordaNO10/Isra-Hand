import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./Home";
import About from "../About us/about";
import Contact from "../Contact us/contact";
import Footer from "./Footer";
import Singlepage from "../Donations/singlePage";
import Header from "./Header";
import Donation from "../Donations/donations";
import ForgotPassword from "../Register & Login/ForgotPassword";
import Donationadd from "../Donations/Donationadd";
import SignupPage from "../Register & Login/signup";
import AdminPage from "../userpage/adminpage";
import Signin from "../Register & Login/Signin";
import PrivateRoute from "../Register & Login/PrivateRoute";
import RequestorDashboard from "../userpage/RequestorDashboard";
import DonatorDashBoard from "../userpage/donorpage";
import ResetPassword from "../Register & Login/ResetPassword";

const MyRouter = ({ onLogout }) => {
  // Accept onLogout as a prop
  return (
    <>
      <Header onLogout={onLogout} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/About" element={<About />} />
        <Route path="/Signup" element={<SignupPage />} />
        <Route path="/Signin" element={<Signin />} />
        <Route path="/Donations" element={<Donation />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/ResetPassword/:token" element={<ResetPassword />} />

        {/* Protected routes for Admin and Donator */}
        <Route
          path="/Donationadd"
          element={
            <PrivateRoute element={<Donationadd />} roles={["1", "2"]} />
          }
        />

        <Route path="/Donations/:id" element={<Singlepage />} />

        <Route
          path="/requestorDashboard"
          element={
            <PrivateRoute element={<RequestorDashboard />} roles={"3"} />
          }
        />

        <Route
          path="/Admin"
          element={<PrivateRoute element={<AdminPage />} roles={["1"]} />}
        />

        <Route
          path="/donorpage"
          element={<DonatorDashBoard onLogout={onLogout} />}
        />
        <Route path="/Contact" element={<Contact />} />
        <Route path="*" element={<h1 className="main">Not Found</h1>} />
      </Routes>
      <Footer />
    </>
  );
};

export default MyRouter;
