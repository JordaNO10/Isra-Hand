const { sendMail } = require("../../utils/mailer");
const db = require("../../utils/db");

const sendRated = (donation_id, requestor_id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        r.rating_level, r.rating_text,
        d.donation_name,
        req.full_name AS requestor_name,
        req.email AS requestor_email,
        don.full_name AS donor_name,
        don.email AS donor_email
      FROM ratings r
      JOIN donations d ON d.donation_id = r.donation_id
      JOIN users req ON req.user_id = r.user_id
      JOIN users don ON don.user_id = d.user_id
      WHERE r.donation_id = ? AND r.user_id = ?
      ORDER BY r.rating_id DESC LIMIT 1;
    `;

    db.query(sql, [donation_id, requestor_id], async (err, results) => {
      if (err) return reject("Database error while fetching rating");

      if (!results.length) return reject("Rating not found");

      const {
        rating_level,
        rating_text,
        donation_name,
        requestor_name,
        requestor_email,
        donor_name,
        donor_email,
      } = results[0];

      const requestorMessage = `
שלום ${requestor_name},

תודה רבה על הדירוג שלך לתרומה "${donation_name}" דרך IsraHand!
הדירוג שלך: ${rating_level} כוכבים${
        rating_text ? `\nהערתך: ${rating_text}` : ""
      }

המשוב שלך חשוב לנו מאוד!

בברכה,
צוות IsraHand
      `;

      const donorMessage = `
שלום ${donor_name},

התרומה שלך "${donation_name}" דורגה כ-${rating_level} כוכבים על ידי מקבל התרומה.
תודה רבה על הנתינה שלך!

בברכה,
צוות IsraHand
      `;

      try {
        // Send to requestor (the one who rated)
        await sendMail({
          to: requestor_email,
          subject: "תודה על הדירוג שלך!",
          text: requestorMessage,
        });

        // Send to donor (whose donation was rated)
        await sendMail({
          to: donor_email,
          subject: "התרומה שלך דורגה!",
          text: donorMessage,
        });

        resolve();
      } catch (emailErr) {
        reject("Failed to send one or more emails");
      }
    });
  });
};

module.exports = sendRated;
