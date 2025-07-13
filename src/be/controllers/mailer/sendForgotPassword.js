// controllers/mailer/sendForgotPassword.js
const db = require("../../utils/db");
const {sendMail} = require("../../utils/mailer");
const crypto = require("crypto");
const { passwordResetRequest } = require("../../templates/emailTemplates");

const sendForgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log("📩 Forgot password request body:", req.body);

  if (!email) {
    return res
      .status(400)
      .json({ success: false, error: "יש להזין כתובת אימייל" });
  }

  try {
    const [users] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(404).json({ success: false, error: "המשתמש לא נמצא" });
    }

    const user = users[0];
    const token = crypto.randomBytes(32).toString("hex");

    // ✅ Store token in DB
    await db
      .promise()
      .query("UPDATE users SET reset_token = ? WHERE user_id = ?", [
        token,
        user.user_id,
      ]);

    const resetLink = `${process.env.FRONTEND_BASE_URL}/resetpassword/${token}`;

    const message = passwordResetRequest(user.full_name, resetLink);

    await sendMail({
      to: email,
      subject: "איפוס סיסמה - IsraHand",
      html: message,
    });

    res.status(200).json({ success: true, message: "אימייל איפוס נשלח" });
  } catch (error) {
    console.error("שגיאה בשליחת אימייל איפוס:", error);
    res.status(500).json({ success: false, error: "שליחת האימייל נכשלה" });
  }
};

module.exports = sendForgotPassword;
