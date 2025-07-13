require("dotenv").config();
const nodemailer = require("nodemailer");
const { emailVerificationTemplate } = require("../templates/emailTemplates"); // ✅ this line

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

const sendRegistration = async (email, fullName, verifyUrl) => {
  const html = emailVerificationTemplate(fullName, verifyUrl);
  const subject = "אימות כתובת אימייל - IsraHand";

  return sendMail({ to: email, subject, html });
};

module.exports = {
  sendMail,
  sendRegistration,
};
