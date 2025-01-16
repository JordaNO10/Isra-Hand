import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Homepage from "./components/homepage";
import About from "./components/about";
import Contact from "./components/contact";
import logo from "./assets/IsraHand.jpg";
function App() {
  return (
    <div>
      <h1>
        <img src={logo} alt="Logo" height="35" width="auto" />
        IsraHand{" "}
        <img src={logo} alt="Logo" height="35" width="auto" />
      </h1>
      <Router>
        <nav>
          <ul>
            <li>
              <Link to="/">Homepage</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/About" element={<About />} />
          <Route path="/Contact" element={<Contact />} />
        </Routes>
      </Router>
      <footer>
        © 2024 All Rights Reserved
        <br />
        Yarden Halely
      </footer>
    </div>
  );
}

export default App;
