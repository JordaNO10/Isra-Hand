/**
 * פונקציה זו מטפלת בשליחת מיילי התראה למשתמשים לא פעילים.
 * תהליך: שליפת משתמשים, בדיקה מי לא נכנס יותר מ־4 ימים,
 * ושליחת מייל אישי לכל משתמש כזה.
 */

const db = require("../../utils/db");
const sendMail = require("../../utils/mailer");
const dayjs = require("dayjs");

const sendNotification = async (req, res) => {
  try {
    // שליפת משתמשים רלוונטיים בלבד
    const [users] = await db
      .promise()
      .query("SELECT full_name, last_login, email FROM users");

    // סינון משתמשים שלא התחברו מעל 4 ימים
    const inactiveUsers = users.filter((user) => {
      const lastLogin = dayjs(user.last_login);
      return dayjs().diff(lastLogin, "day") > 4;
    });

    // שליחת מייל לכל משתמש לא פעיל
    for (const user of inactiveUsers) {
      await sendMail(
        user.email,
        "מתגעגעים אליך!",
        `שלום ${user.full_name},\n\nשמת לב שעברו מספר ימים מאז הפעם האחרונה שנכנסת לאתר Isra-Hand?\nנשמח לראות אותך שוב :)\n\nבברכה,\nצוות Isra-Hand`
      );
    }

    res.json({ message: `${inactiveUsers.length} emails sent.` });
  } catch (error) {
    console.error("שגיאה בשליחת התראות:", error);
    res.status(500).json({ error: "Failed to send notifications" });
  }
};

module.exports = sendNotification;
