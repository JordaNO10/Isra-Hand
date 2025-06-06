const express = require("express");
const router = express.Router();

// Controllers
const sendNotification = require("../controllers/mailer/sendNotification");
const sendForgotPassword = require("../controllers/mailer/sendForgotPassword");
const sendThankYou = require("../controllers/mailer/sendThankYou");
const sendApproval = require("../controllers/mailer/sendApproval");
const sendAlert = require("../controllers/mailer/sendAlert");

// Routes

// התראה כללית (POST)
router.post("/notify", sendNotification);

// שכחתי סיסמה (POST)
router.post("/forgot-password", sendForgotPassword);

// תודה על תרומה (POST)
router.post("/thank-you", sendThankYou);

// אישור תרומה (POST)
router.post("/approval", sendApproval);

// שליחת התראה כללית (POST)
router.post("/alert", sendAlert);

// בדיקה - זמני (GET)
router.get("/test", (req, res) => {
  res.send("Mailer routes are working ✅");
});

module.exports = router;
