/**
 * פונקציה זו מסמנת תרומה כמאושרת (accepted = 1).
 * מתבצעת בדיקה שקיים גם מזהה התרומה וגם מזהה המבקש,
 * אחרת מוחזרת שגיאה מתאימה.
 */

const db = require("../../utils/db");

const markDonationAsAccepted = (req, res) => {
  const { donationId } = req.params;
  const { requestor_id } = req.body;

  // בדיקה ששדות חובה קיימים
  if (!donationId || !requestor_id) {
    return res
      .status(400)
      .json({ error: "Missing donationId or requestor_id" });
  }

  // עדכון התרומה כמאושרת
  const sql = `
    UPDATE donations 
    SET accepted = 1 
    WHERE donation_id = ? AND requestor_id = ?
  `;

  db.query(sql, [donationId, requestor_id], (error, results) => {
    if (error) {
      console.error("שגיאת מסד נתונים בעת עדכון תרומה:", error);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Donation not found or requestor mismatch." });
    }

    res.status(200).json({ message: "Donation marked as accepted successfully." });
  });
};

module.exports = markDonationAsAccepted;
