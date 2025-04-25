const db = require("../../utils/db");
const { buildImageUrl } = require("../../utils/helpers");

const addDonation = (req, res) => {
  const { donationname, description, categoryId, email } = req.body;
  const imageUrl = req.file ? buildImageUrl(req, req.file.filename) : null;

  if (!donationname || !description || !categoryId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `
    INSERT INTO donations (donation_name, description, category_id, donat_photo, email)
    VALUES (?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [donationname, description, categoryId, imageUrl, email],
    (error, results) => {
      if (error) {
        console.error("Database error during donation add:", error);
        return res.status(500).json({ error: "Database error" });
      }

      res.status(201).json({
        message: "Donation added successfully",
        donationId: results.insertId,
      });
    }
  );
};

module.exports = addDonation;
