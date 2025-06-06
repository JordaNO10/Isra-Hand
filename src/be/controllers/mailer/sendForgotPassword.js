// controllers/mailer/sendForgotPassword.js
const db = require("../../utils/db");
const sendMail = require("../../utils/sendMail");
const crypto = require("crypto");

const sendForgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, error: "יש להזין כתובת אימייל" });
  }

  try {
    // 1. Find user by email
    const [users] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(404).json({ success: false, error: "המשתמש לא נמצא" });
    }

    const user = users[0];

    // 2. Generate a secure token (for production: store in DB and expire)
    const token = crypto.randomBytes(32).toString("hex");

    // (Optional: Store token in DB for validation)
    // await db.promise().query("UPDATE users SET reset_token = ? WHERE user_id = ?", [token, user.user_id]);

    const resetLink = `http://localhost:3000/reset-password/${token}`;

    const message = `
      שלום ${user.full_name},

      קיבלת בקשת איפוס סיסמה לאתר Isra-Hand.
      לחץ על הקישור הבא כדי לאפס את הסיסמה שלך:
      ${resetLink}

      אם לא ביקשת איפוס, ניתן להתעלם מהודעה זו.

      בברכה,
      צוות Isra-Hand
    `;

    // 3. Send email
    await sendMail(email, "איפוס סיסמה - IsraHand", message);

    res.status(200).json({ success: true, message: "אימייל איפוס נשלח" });
  } catch (error) {
    console.error("שגיאה בשליחת אימייל איפוס:", error);
    res.status(500).json({ success: false, error: "שליחת האימייל נכשלה" });
  }
};

module.exports = sendForgotPassword;
