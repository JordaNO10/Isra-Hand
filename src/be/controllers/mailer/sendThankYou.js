/**
 * פונקציה זו מטפלת בשליחת מייל תודה לתורם.
 * ההודעה מותאמת אישית לפי שם התורם.
 */

const { sendMail } = require("../../utils/mailer");

const sendThankYou = async (req, res) => {
  const { to, name } = req.body;

  const message = `שלום ${name}, תודה רבה על התרומה שלך דרך IsraHand! המעשה שלך עושה שינוי אמיתי.`;

  try {
    await sendMail(to, "תודה על התרומה שלך!", message);
    res.status(200).json({ success: true, message: "אימייל תודה נשלח" });
  } catch (error) {
    console.error("שגיאה בשליחת אימייל תודה:", error);
    res.status(500).json({ success: false, error: "שליחת האימייל נכשלה" });
  }
};

module.exports = sendThankYou;
