// controllers/mailer/sendNotification.js
const db = require("../../utils/db");
const sendMail = require("../../utils/mailer");
const dayjs = require("dayjs");

const sendNotification = async (req, res) => {
  try {
    // Only get relevant fields from users
    const [users] = await db
      .promise()
      .query("SELECT full_name, last_login, email FROM users");

    // Filter users who haven't logged in for more than 4 days
    const inactiveUsers = users.filter((user) => {
      const lastLogin = dayjs(user.last_login);
      return dayjs().diff(lastLogin, "day") > 4;
    });

    // Send email to each inactive user
    for (const user of inactiveUsers) {
      await sendMail(
        user.email,
        "מתגעגעים אליך!",
        `שלום ${user.full_name},\n\nשמת לב שעברו מספר ימים מאז הפעם האחרונה שנכנסת לאתר Isra-Hand?\nנשמח לראות אותך שוב :)\n\nבברכה,\nצוות Isra-Hand`
      );
    }

    res.json({ message: `${inactiveUsers.length} emails sent.` });
  } catch (error) {
    console.error("Error sending notifications:", error);
    res.status(500).json({ error: "Failed to send notifications" });
  }
};

module.exports = sendNotification;
