const db = require("../../utils/db");
const bcrypt = require("bcrypt");

const loginUser = (req, res) => {
  const { emailOrUsername, password } = req.body;

  const sql =
    "SELECT user_id, password, role_id FROM users WHERE email = ? OR username = ?";

  db.query(sql, [emailOrUsername, emailOrUsername], (error, results) => {
    if (error) return res.status(500).json({ error: "Database error" });

    if (results.length === 0) {
      return res
        .status(401)
        .json({ error: "Invalid email/username or password." });
    }

    bcrypt.compare(password, results[0].password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      // Save user ID and role into session
      req.session.userId = results[0].user_id;
      req.session.roleId = results[0].role_id;

      res.status(200).json({
        message: "Signin successful!",
        userId: results[0].user_id,
        roleId: results[0].role_id,
      });
    });
  });
};

module.exports = loginUser;
