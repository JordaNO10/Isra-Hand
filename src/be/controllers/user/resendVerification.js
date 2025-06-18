const crypto = require("crypto");
const db = require("../../utils/db");
const sendMail = require("../../utils/mailer");
require("dotenv").config(); // For FRONTEND_BASE_URL

const resendVerification = (req, res) => {
  console.log(
    "📨 Resend verification email request received for:",
    req.body.email
  );

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const selectSql = "SELECT * FROM users WHERE email = ?";
  db.query(selectSql, [email], (selectErr, results) => {
    if (selectErr) {
      console.error("❌ DB Error:", selectErr);
      return res.status(500).json({ error: "Server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = results[0];
    console.log("🔎 Found user:", user);
    console.log(
      "🔐 is_verified:",
      user.is_verified,
      "| token:",
      user.verification_token
    );

    if (user.is_verified) {
      return res.status(400).json({ error: "User already verified" });
    }

    const newToken = crypto.randomBytes(32).toString("hex");
    const updateSql = "UPDATE users SET verification_token = ? WHERE email = ?";

    db.query(updateSql, [newToken, email], async (updateErr) => {
      if (updateErr) {
        console.error("❌ Token update error:", updateErr);
        return res.status(500).json({ error: "Failed to update token" });
      }

      const verifyLink = `${process.env.FRONTEND_BASE_URL}/verify?token=${newToken}`;

      try {
        await sendMail({
          to: email,
          subject: "Verify your email address",
          html: `<p>Click <a href="${verifyLink}">here</a> to verify your email address.</p>`,
        });

        res.json({ message: "Verification email sent" });
      } catch (mailErr) {
        console.error("❌ Mail sending failed:", mailErr);
        res.status(500).json({ error: "Failed to send verification email" });
      }
    });
  });
};

module.exports = resendVerification;
