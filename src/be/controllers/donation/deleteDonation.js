const db = require("../../utils/db");
const fs = require("fs");
const path = require("path");

const deleteDonation = async (req, res) => {
  const { id } = req.params;

  try {
    // Get image path and check if donation is already chosen
    const [results] = await db
      .promise()
      .query(
        "SELECT donat_photo, requestor_id FROM donations WHERE donation_id = ?",
        [id]
      );

    if (results.length === 0) {
      return res.status(404).json({ error: "Donation not found." });
    }

    const { donat_photo: imageUrl, requestor_id } = results[0];

    // Prevent deleting if chosen
    if (requestor_id) {
      return res.status(403).json({
        error: "Cannot delete a donation that has been chosen by a requestor.",
      });
    }

    // Delete the donation
    await db
      .promise()
      .query("DELETE FROM donations WHERE donation_id = ?", [id]);

    // Delete associated image if exists
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
