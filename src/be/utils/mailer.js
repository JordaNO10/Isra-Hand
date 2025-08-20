/**
 * מודול שליחת מיילים (Mailer)
 * תפקיד: הגדרת טרנספורטר עם Nodemailer ושליחת הודעות מייל שונות (אימות, שכחת סיסמה וכו').
 * כאן מוגדרות פונקציות כלליות לשליחת מיילים וכן פונקציה ייעודית לאימות הרשמה.
 */

require("dotenv").config();
const nodemailer = require("nodemailer");
const { emailVerificationTemplate } = require("../templates/emailTemplates"); // תבנית מייל לאימות

// יצירת טרנספורטר עם Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// פונקציה כללית לשליחת מייל
const sendMail = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: `"Isra-Hand" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  console.log("[DEBUG] Mail Options:", mailOptions);
  return transporter.sendMail(mailOptions);
};

// פונקציה לשליחת מייל אימות הרשמה
const sendRegistration = async (email, fullName, verifyUrl) => {
  const html = emailVerificationTemplate(fullName, verifyUrl);
  const subject = "אימות כתובת אימייל - IsraHand";
  return sendMail({ to: email, subject, html });
};

// ייצוא הפונקציות
module.exports = {
  sendMail,
  sendRegistration,
};
