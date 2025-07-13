const crypto = require("crypto");
const db = require("../../utils/db"); // or your DB config
const {sendMail} = require("../../utils/mailer");
require("dotenv").config();
const { emailVerificationTemplate } = require("../../templates/emailTemplates");

const resendVerification = (req, res) => {
  const { emailOrUsername } = req.body;

  if (!emailOrUsername) {
    return res.status(400).json({ error: "Email or Username is required" });
  }

  const selectSql = `
    SELECT * FROM users 
    WHERE email = ? OR username = ?
    LIMIT 1
  `;

  db.query(selectSql, [emailOrUsername, emailOrUsername], (err, results) => {
    if (err) {
      console.error("❌ DB Error:", err);
      return res.status(500).json({ error: "Server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = results[0];

    if (user.is_verified) {
      return res.status(400).json({ error: "User is already verified" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    const updateSql = `
      UPDATE users 
      SET verification_token = ? 
      WHERE user_id = ?
    `;

    db.query(updateSql, [token, user.user_id], (updateErr) => {
      if (updateErr) {
        console.error("❌ Token Update Error:", updateErr);
        return res.status(500).json({ error: "Failed to update token" });
      }

      const verifyUrl = `${process.env.FRONTEND_BASE_URL}/verify?token=${token}`;

      const mailOptions = {
        to: user.email,
        subject: 'אימות כתובת דוא"ל - Isra-Hand',
        html: emailVerificationTemplate(
          user.full_name || user.username,
          verifyUrl
        ),
      };

      sendMail(mailOptions)
        .then(() =>
          res.status(200).json({ message: "Verification email sent" })
        )
        .catch((mailErr) => {
          console.error("❌ Mail Error:", mailErr);
          res.status(500).json({ error: "Failed to send email" });
        });
    });
  });
};

module.exports = { resendVerification };
