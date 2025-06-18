const db = require("../../utils/db");
const { buildImageUrl } = require("../../utils/helpers");
const sendMail = require("../../utils/mailer");
const { donationThankYou } = require("../../templates/emailTemplates");

const addDonation = (req, res) => {
  const { donationname, description, categoryId, email, user_id, full_name } =
    req.body;
  const imageUrl = req.file ? buildImageUrl(req, req.file.filename) : null;
  const date = new Date().toISOString().split("T")[0];

  // Validation
  if (!donationname || !description || !categoryId || !user_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `
    INSERT INTO donations (donation_name, description, category_id, donat_photo, email, user_id, donation_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [donationname, description, categoryId, imageUrl, email, user_id, date],
    async (error, results) => {
      if (error) {
        console.error("Database error during donation add:", error);
        return res.status(500).json({ error: "Database error" });
      }

      const message = donationThankYou(
        full_name || "תורם/ת יקר/ה",
        donationname
      );

      try {
        await sendMail(email, "תודה על תרומתך - Isra-Hand", message);
        console.log("📧 Thank-you email sent to:", email);
      } catch (emailErr) {
        console.error(
          "❌ Failed to send donation thank-you email:",
          emailErr.message
        );
      }

      res.status(201).json({
        message: "Donation added successfully",
        donationId: results.insertId,
      });
    }
  );
};

module.exports = addDonation;
