const bcrypt = require("bcrypt");
const { q, send500 } = require("../helpers/utils");

const loginUser = async (req, res) => {
  const { emailOrUsername, password } = req.body;
  try {
    const [rows] = await q("SELECT * FROM users WHERE email = ? OR username = ?", [emailOrUsername, emailOrUsername]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: "Invalid email/username or password." });

    const ok = await bcrypt.compare(password, user.password_hash || user.password);
    if (!ok) return res.status(401).json({ error: "Invalid email/username or password." });

    req.session.userId = user.user_id;
    req.session.roleId = user.role_id;
    req.session.username = user.username;
    res.status(200).json({ message: "Signin successful!", userId: user.user_id, roleId: user.role_id, fullName: user.full_name });
  } catch (err) {
    return send500(res, "Database error", err);
  }
};

module.exports = loginUser;