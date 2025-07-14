const db = require("../../utils/db");
const { buildImageUrl } = require("../../utils/helpers");
const { sendMail } = require("../../utils/mailer");
const { donationThankYou } = require("../../templates/emailTemplates");

const addDonation = (req, res) => {
  const {
    donationname,
    description,
    categoryName,
    subCategoryName,
    email,
    user_id,
    full_name,
    Phonenumber,
  } = req.body;

  const imageUrl = req.file ? buildImageUrl(req, req.file.filename) : null;
  const date = new Date().toISOString().split("T")[0];

  // Validate required fields
  if (
    !donationname ||
    !description ||
    !categoryName ||
    !subCategoryName ||
    !user_id
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Step 1: Find the matching category_id
  const findCategorySql = `
    SELECT category_id FROM categories
    WHERE category_name = ? AND sub_category = ?
    LIMIT 1
  `;

  db.query(findCategorySql, [categoryName, subCategoryName], (err, results) => {
    if (err) {
      console.error("❌ Error finding category:", err);
      return res
        .status(500)
        .json({ error: "Database error while finding category" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    const category_id = results[0].category_id;

    // Step 2: Insert donation
    const insertSql = `
      INSERT INTO donations (
        donation_name,
        description,
        category_id,
        donat_photo,
        email,
        user_id,
        donation_date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertSql,
      [donationname, description, category_id, imageUrl, email, user_id, date],
      async (error, results) => {
        if (error) {
          console.error("❌ Database error during donation add:", error);
          return res.status(500).json({ error: "Database insert error" });
        }

        const donationId = results.insertId;

        const message = donationThankYou(
          full_name || "תורם/ת יקר/ה",
          donationname,
          donationId
        );

        try {
          await sendMail({
            to: email,
            subject: "תודה על תרומתך - Isra-Hand",
            html: message,
          });
          console.log("📧 Thank-you email sent to:", email);
        } catch (emailErr) {
          console.error(
            "❌ Failed to send donation thank-you email:",
            emailErr.message
          );
        }

        res.status(201).json({
          message: "Donation added successfully",
          donationId,
        });
      }
    );
  });
};

module.exports = addDonation;
