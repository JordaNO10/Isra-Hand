const express = require("express");
const router = express.Router();
const Cookies = require("js-cookie"); // This is for client-side cookie management, not required on server-side.

// POST /logout - Handle user logout
router.post("/", (req, res) => {
  // Clear cookies or session data here
  res.clearCookie("userId"); // Adjust the cookie name as necessary

  // Optionally, you can also destroy the session if you're using sessions
  // req.session.destroy((err) => {
  //   if (err) {
  //     return res.status(500).json({ error: "Failed to log out." });
  //   }
  // });

  res.status(200).json({ message: "Successfully logged out." });
});

module.exports = router;
