const logoutUser = (req, res) => {
  if (!req.session) {
    return res.status(400).json({ error: "No active session found." });
  }

  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to log out." });
    }

    res.clearCookie("connect.sid"); // Important: Clear the session cookie
    res.status(200).json({ message: "Successfully logged out." });
  });
};

module.exports = logoutUser;
