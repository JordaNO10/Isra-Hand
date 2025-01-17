import React from "react";
import { Route, Routes } from "react-router-dom";
import Homepage from "./homepage";
import About from "./about";
import Contact from "./contact";
import Footer from "./Footer";
import Singlepage from "./singlePage";
import Header from "./Header";
import Donation from "./donation";
import "../css/style.css";
const MyRouter = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/About" element={<About />} />
        <Route path="/Donation" element={<Donation />} />
        <Route path="/Donation/:id" element={<Singlepage />} />

        <Route path="/Contact" element={<Contact />} />
        <Route path="*" element={<h1 className="main">Not Found</h1>} />
      </Routes>
      <Footer />
    </>
  );
};
export default MyRouter;
