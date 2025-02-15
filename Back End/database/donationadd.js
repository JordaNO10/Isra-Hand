const express = require("express");
const router = express.Router();
const connection = require("./connection.js"); // Ensure path is correct
const upload = require("../config/multer.js"); // Ensure path is correct

// POST /donationadd
router.post("/", upload.single("image"), (req, res) => {
  const { donationname, description, categoryId, email } = req.body;

  const imageName = req.file ? req.file.filename : null; // Get the filename from req.file

  // Construct the full URL for the uploaded image
  const imageUrl = req.file
    ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    : null;

  if (!donationname || !description || !categoryId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  console.log("Received donation request:", {
    donationname,
    description,
    categoryId,
    donat_photo: imageUrl, // Store the full image URL
    email,
  });

  const sql =
    "INSERT INTO donations (donation_name, description, category_id, donat_photo, email) VALUES (?, ?, ?, ?, ?)";

  connection.query(
    sql,
    [donationname, description, categoryId, imageUrl, email], // Use imageUrl here
    (error, results) => {
      if (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Database error" });
      }

      console.log("Donation added successfully with ID:", results.insertId);
      res.status(201).json({
        message: "Donation added successfully",
        donationId: results.insertId,
      });
    }
  );
});

module.exports = router;
