const db = require("../../utils/db");
const bcrypt = require("bcrypt");

const loginUser = (req, res) => {
  const { emailOrUsername, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ? OR username = ?";

  db.query(sql, [emailOrUsername, emailOrUsername], (error, results) => {
    if (error) return res.status(500).json({ error: "Database error" });

    if (results.length === 0) {
      return res
        .status(401)
        .json({ error: "Invalid email/username or password." });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      // ✅ Block login if user is not verified
      if (!user.is_verified) {
        return res.status(401).json({ error: "אנא אמת את כתובת האימייל שלך" });
      }

      const updateLoginTimeSql =
        "UPDATE users SET last_login = NOW() WHERE user_id = ?";
      db.query(updateLoginTimeSql, [user.user_id], (updateErr) => {
        if (updateErr) {
          return res.status(500).json({ error: "Failed to update last_login" });
        }

        req.session.userId = user.user_id;
        req.session.roleId = user.role_id;
        req.session.username = user.username;

        res.status(200).json({
          message: "Signin successful!",
          userId: user.user_id,
          roleId: user.role_id,
          fullName: user.full_name,
        });
      });
    });
  });
};

module.exports = loginUser;
