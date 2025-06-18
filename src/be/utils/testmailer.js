const express = require("express");
const router = express.Router();
const sendMail = require("./mailer");

router.get("/test-email", async (req, res) => {
  try {
    await sendMail(
      "jordanhalely@gmail.com",
      "Testing",
      "This is a test message."
    );
    res.send("Email sent!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong!" });
  }
});

module.exports = router;
