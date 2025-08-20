/**
 * פונקציה זו מטפלת בשליחת מייל אישור לתורם.
 * ההודעה כוללת את שם התרומה והודעת תודה.
 */

const { sendMail } = require("../../utils/mailer");

const sendApproval = async (req, res) => {
  const { to, donationName } = req.body;

  const message = `התרומה שלך "${donationName}" אושרה בהצלחה! תודה רבה על שיתוף הפעולה.`;

  try {
    await sendMail(to, "אישור תרומה - IsraHand", message);
    res.status(200).json({ success: true, message: "אימייל אישור נשלח" });
  } catch (error) {
    console.error("שגיאה בשליחת אימייל אישור:", error);
    res.status(500).json({ success: false, error: "שליחת האימייל נכשלה" });
  }
};

module.exports = sendApproval;
