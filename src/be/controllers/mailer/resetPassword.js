// controllers/mailer/resetPassword.js
const db = require("../../utils/db");
const bcrypt = require("bcrypt");
const sendMail = require("../../utils/mailer");
const { passwordResetSuccess } = require("../../templates/emailTemplates");

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: "Token or password missing" });
  }

  try {
    const [users] = await db
      .promise()
      .query("SELECT * FROM users WHERE reset_token = ?", [token]);

    if (users.length === 0) {
      return res.status(404).json({ message: "קישור לא תקף או שפג תוקפו" });
    }

    const user = users[0];
    const hashedPassword = await bcrypt.hash(password, 12);

    await db
      .promise()
      .query(
        "UPDATE users SET password = ?, reset_token = NULL WHERE user_id = ?",
        [hashedPassword, user.user_id]
      );

    const successMessage = passwordResetSuccess(user.full_name);
    await sendMail({
      to: user.email,
      subject: "סיסמה אופסה בהצלחה",
      html: successMessage,
    });

    res.json({ message: "הסיסמה אופסה בהצלחה" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "שגיאה בשרת במהלך איפוס הסיסמה" });
  }
};

module.exports = resetPassword;
