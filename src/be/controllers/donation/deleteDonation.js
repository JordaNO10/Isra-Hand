/**
 * פונקציה זו מטפלת במחיקת תרומה.
 * השלבים: בדיקת קיום התרומה, וידוא שלא נבחרה ע"י מבקש,
 * מחיקת התרומה מהמסד, ומחיקת תמונה מקומית אם קיימת.
 */

const db = require("../../utils/db");
const fs = require("fs");
const path = require("path");

const deleteDonation = async (req, res) => {
  const { id } = req.params;

  try {
    // שליפת פרטי התרומה
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

    // לא מאפשרים מחיקה אם התרומה כבר נבחרה
    if (requestor_id) {
      return res.status(403).json({
        error: "Cannot delete a donation that has been chosen by a requestor.",
      });
    }

    // מחיקת התרומה מהמסד
    await db.promise().query("DELETE FROM donations WHERE donation_id = ?", [id]);

    // מחיקת תמונה פיזית אם קיימת
    if (imageUrl) {
      const imagePath = path.join(
        __dirname,
        "../../uploads",
        path.basename(imageUrl)
      );

      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("שגיאה במחיקת תמונה:", err);
        } else {
          console.log("✅ תמונה נמחקה בהצלחה:", imagePath);
        }
      });
    }

    res.json({ message: "Donation deleted successfully." });
  } catch (error) {
    console.error("שגיאה במחיקת תרומה:", error);
    res.status(500).json({ error: "Failed to delete donation." });
  }
};

module.exports = deleteDonation;
