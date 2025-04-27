// backend/routes/forgotPassword.js
const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const connection = require("../config/session");

// Store reset tokens temporarily (you can improve it later to DB)
const resetTokens = {};

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "נא להכניס אימייל." });
  }

  try {
    // Check if user exists
    const [rows] = await connection
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "לא נמצא משתמש עם אימייל זה." });
    }

    const user = rows[0];

    // Generate secure token
    const token = crypto.randomBytes(20).toString("hex");
    resetTokens[token] = {
      email: user.email,
      expires: Date.now() + 3600000, // Token valid for 1 hour
    };

    // Create reset link
    const resetLink = `http://localhost:3000/ResetPassword/${token}`;

    // Setup Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "IsraHand@gmail.com", // ✅ Replace with your email
        pass: "YOUR_EMAIL_PASSWORD", // ✅ Replace with your password or App Password
      },
    });

    // Send email
    const mailOptions = {
      to: user.email,
      from: "israhand.support@gmail.com",
      subject: "איפוס סיסמה ל-IsraHand",
      text: `שלום,\n\nלחץ על הקישור הבא כדי לאפס את הסיסמה שלך:\n\n${resetLink}\n\nאם לא ביקשת איפוס סיסמה, התעלם מהודעה זו.\n`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "נשלח קישור לאיפוס הסיסמה לאימייל." });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "שגיאה בשרת, נסה מאוחר יותר." });
  }
});
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const resetData = resetTokens[token];

  if (!resetData) {
    return res
      .status(400)
      .json({ message: "קישור איפוס לא חוקי או שפג תוקפו." });
  }

  if (resetData.expires < Date.now()) {
    return res.status(400).json({ message: "פג תוקף הקישור." });
  }

  try {
    // Update the user's password in the database
    await connection
      .promise()
      .query("UPDATE users SET password = ? WHERE email = ?", [
        password,
        resetData.email,
      ]);

    // Remove the token after successful reset
    delete resetTokens[token];

    res.json({ message: "הסיסמה אופסה בהצלחה!" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "שגיאה באיפוס הסיסמה." });
  }
});

// Export the resetTokens object to use later
module.exports = { router, resetTokens };
