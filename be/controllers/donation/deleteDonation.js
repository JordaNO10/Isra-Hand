const db = require('../../utils/db');
const fs = require('fs');
const path = require('path');

const deleteDonation = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if donation exists and get image path
    const [results] = await db.promise().query(
      "SELECT donat_photo FROM donations WHERE donation_id = ?",
      [id]
    );

    if (results.length === 0) {
      return res.status(404).json({ error: "Donation not found." });
    }

    const imageUrl = results[0].donat_photo;

    // Delete the donation record
    await db.promise().query(
      "DELETE FROM donations WHERE donation_id = ?",
      [id]
    );

    // If there was an image, delete it from uploads
    if (imageUrl) {
      const imagePath = path.join(
        __dirname,
        "../../uploads",
        path.basename(imageUrl)
      );

      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        } else {
          console.log("Image deleted successfully:", imagePath);
        }
      });
    }

    res.json({ message: "Donation deleted successfully." });
  } catch (error) {
    console.error("Error deleting donation:", error);
    res.status(500).json({ error: "Failed to delete donation." });
  }
};

module.exports = deleteDonation;
