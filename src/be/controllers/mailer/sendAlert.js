const sendMail = require("../../utils/mailer");

const sendAlert = async (req, res) => {
  const { to, alertMessage } = req.body;

  try {
    await sendMail(to, "התראה מ-IsraHand", alertMessage);
    res.status(200).json({ success: true, message: "אימייל התראה נשלח" });
  } catch (error) {
    console.error("שגיאה בשליחת התראה:", error);
    res.status(500).json({ success: false, error: "שליחת ההתראה נכשלה" });
  }
};

module.exports = sendAlert;
