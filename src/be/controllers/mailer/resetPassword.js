/**
 * פונקציה זו מטפלת באיפוס סיסמה ע"י טוקן שהתקבל במייל.
 * שלבים: בדיקה שהטוקן והסיסמה קיימים, בדיקה אם המשתמש קיים,
 * עדכון סיסמה מוצפנת במסד וניקוי הטוקן, ושליחת מייל הצלחה (לא חוסם).
 */

const db = require("../../utils/db");
const bcrypt = require("bcrypt");
const { sendMail } = require("../../utils/mailer");
const { passwordResetSuccess } = require("../../templates/emailTemplates");

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  // בדיקה ששדות חובה קיימים
  if (!token || !password) {
    return res.status(400).json({ message: "Token or password missing" });
  }

  try {
    // חיפוש משתמש לפי טוקן
    const [users] = await db
      .promise()
      .query("SELECT * FROM users WHERE reset_token = ?", [token]);

    if (users.length === 0) {
      return res.status(404).json({ message: "קישור לא תקף או שפג תוקפו" });
    }

    const user = users[0];
    const hashedPassword = await bcrypt.hash(password, 12);

    // עדכון סיסמה ומחיקת הטוקן
    await db
      .promise()
      .query(
        "UPDATE users SET password = ?, reset_token = NULL WHERE user_id = ?",
        [hashedPassword, user.user_id]
      );

    // שליחת מייל הצלחה (לא עוצרת את התהליך במקרה של שגיאה)
    try {
      const successMessage = passwordResetSuccess(user.full_name);
      await sendMail({
        to: user.email,
        subject: "סיסמה אופסה בהצלחה",
        html: successMessage,
      });
    } catch (mailError) {
      console.error("שליחת מייל איפוס נכשלה:", mailError);
    }

    // תשובת הצלחה ללקוח
    res.status(200).json({
      message: "הסיסמה אופסה בהצלחה",
      email: user.email,
    });
  } catch (err) {
    console.error("שגיאה באיפוס סיסמה:", err);
    res.status(500).json({ message: "שגיאה בשרת במהלך איפוס הסיסמה" });
  }
};

module.exports = resetPassword;
