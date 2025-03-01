const express = require("express");
const router = express.Router();
const db = require("../database/connection.js");
const upload = require("../config/multer.js");
const fs = require("fs");
const path = require("path");

// Get all donations
router.get("/", async (req, res) => {
  const sql = `
    SELECT donations.*, categories.category_name 
    FROM donations 
    JOIN categories ON categories.category_id = donations.category_id
`;

  try {
    console.log("Fetching donations...");
    const [results] = await db.promise().query(sql); // Use promise-based query

    // Return an empty array if no donations are found
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ error: "Failed to fetch donations" });
  }
});

// Get a single donation by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM donations WHERE donation_id = ?";

  try {
    const [results] = await db.promise().query(sql, [id]);

    if (results.length === 0) {
      return res.status(404).json({ error: "Donation not found" });
    }

    res.status(200).json(results[0]); // Return the first (and only) result
  } catch (error) {
    console.error("Error fetching donation:", error);
    res.status(500).json({ error: "Failed to fetch donation" });
  }
});

// Update fields inside the Current Donation

router.put("/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { donation_name, description, email } = req.body;
  const image = req.file
    ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    : null;

  console.log("Request Body:", req.body); // Debugging log
  console.log("Uploaded File:", req.file); // Debugging log
  console.log("Image Filename:", image); // Debugging log

  // Validate that at least one field is provided
  if (!donation_name && !description && !email && !image) {
    return res.status(400).json({ error: "No fields provided for update" });
  }

  // Construct the SQL query dynamically based on the provided fields
  let sql = "UPDATE donations SET ";
  const updates = [];
  const values = [];

  if (donation_name) {
    updates.push("donation_name = ?");
    values.push(donation_name);
  }
  if (description) {
    updates.push("description = ?");
    values.push(description);
  }
  if (email) {
    updates.push("email = ?");
    values.push(email);
  }
  if (image) {
    updates.push("donat_photo = ?");
    values.push(image);
  }

  // Ensure at least one field is being updated
  if (updates.length === 0) {
    return res.status(400).json({ error: "No fields provided for update" });
  }

  sql += updates.join(", ") + " WHERE donation_id = ?";
  values.push(id); // Add the donation ID to the values array

  console.log("SQL Query:", sql); // Debugging log
  console.log("Values:", values); // Debugging log

  try {
    const [results] = await db.promise().query(sql, values);

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Donation not found" });
    }

    res.status(200).json({ message: "Donation updated successfully" });
  } catch (error) {
    console.error("Error updating donation:", error); // Debugging log
    res.status(500).json({ error: "Failed to update donation" });
  }
});
// DELETE /donations/:id
router.delete("/:id", async (req, res) => {
  const donationId = req.params.id;

  try {
    // Check if the donation exists and get the image path
    const [results] = await db
      .promise()
      .query("SELECT donat_photo FROM donations WHERE donation_id = ?", [
        donationId,
      ]);

    if (results.length === 0) {
      return res.status(404).json({ error: "Donation not found" });
    }

    const imageUrl = results[0].donat_photo;

    // Delete the donation from the database
    await db
      .promise()
      .query("DELETE FROM donations WHERE donation_id = ?", [donationId]);

    // If there's an image, delete it from the uploads folder
    if (imageUrl) {
      const imagePath = path.join(
        __dirname,
        "../uploads",
        path.basename(imageUrl)
      );
      console.log("image path to delete :", imagePath);

      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(`Error deleting image at ${imagePath}:`, err);
          return; // Exit the function to avoid further actions
        }
        console.log(`Successfully deleted image at ${imagePath}`);
      });
    }

    res.json({ message: "Donation deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
});
module.exports = router;
