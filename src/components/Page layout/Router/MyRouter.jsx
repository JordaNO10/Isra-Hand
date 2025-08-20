/**
 * MyRouter:
 * אחראי על ניתוב כל הדפים במערכת.
 * כולל שחרור נעילות גלובליות ביציאה בעזרת useUnlockOnUnload.
 */
import { Route, Routes, Navigate } from "react-router-dom";
import Cookies from "js-cookie";

// LAYOUT
import HomePage from "../Layout/Home/Home";
import About from "../../About us/about";
import Contact from "../../Contact us/contact";
import Footer from "../Layout/Footer/Footer";
import Header from "../Layout/Header/Header";

// Donations
import Singlepage from "../../Donations/Singlepage/singlePage";
import Donation from "../../Donations/DonationsPage/Donations";
import Donationadd from "../../Donations/DonationAdd/DonationAdd";
import useUnlockOnUnload from "./useUnlockOnUnload";

// Pages
import AdminPage from "../../userpage/Admin/AdminPage";
import UnifiedDashboard from "../../userpage/Dashboard/UnifiedDashboard";

// Signup & Signin
import ForgotPassword from "../../Register & Login/Password/ForgotPassword";
import SignupPage from "../../Register & Login/signup";
import Signin from "../../Register & Login/Signin/Signin";
import PrivateRoute from "../../Register & Login/Guards/PrivateRoute";
import VerifyEmail from "../../Register & Login/Signin/VerifyEmail";
import ResetPassword from "../../Register & Login/Password/ResetPassword";

const MyRouter = ({ onLogout }) => {
  // תפקיד: בדיקת תפקיד משתמש לניתוב מותנה
  const role = Cookies.get("userRole");

  // תפקיד: שחרור נעילות כאשר המשתמש יוצא מהעמוד
  useUnlockOnUnload();

  return (
    <>
      <Header onLogout={onLogout} />
      <div className="page-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/About" element={<About />} />
          <Route
            path="/Signup"
            element={role ? <Navigate to="/" /> : <SignupPage />}
          />
          <Route
            path="/Signin"
            element={role ? <Navigate to="/" /> : <Signin />}
          />
          <Route path="/Donations" element={<Donation />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/ResetPassword/:token" element={<ResetPassword />} />
          <Route path="/verify" element={<VerifyEmail />} />
          <Route
            path="/Donationadd"
            element={
              <PrivateRoute element={<Donationadd />} roles={["1", "2"]} />
            }
          />
          <Route path="/Donations/:id" element={<Singlepage />} />
          <Route
            path="/Admin"
            element={<PrivateRoute element={<AdminPage />} roles={["1"]} />}
          />
          <Route
            path="/dashboard"
            element={<UnifiedDashboard onLogout={onLogout} />}
          />
          <Route path="/Contact" element={<Contact />} />
          <Route path="*" element={<h1 className="main">Not Found</h1>} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default MyRouter;
