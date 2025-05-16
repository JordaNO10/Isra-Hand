// FILE: markDonationAsAccepted.js

const db = require("../../utils/db");

const markDonationAsAccepted = (req, res) => {
  const { donationId } = req.params;
  const { requestor_id } = req.body;

  // Ensure both required fields are provided
  if (!donationId || !requestor_id) {
    return res
      .status(400)
      .json({ error: "Missing donationId or requestor_id" });
  }

  // Update the accepted status to 1
  const sql = `
    UPDATE donations 
    SET accepted = 1 
    WHERE donation_id = ? AND requestor_id = ?`;

  db.query(sql, [donationId, requestor_id], (error, results) => {
    if (error) {
      console.error("Database error while updating donation:", error);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Donation not found or requestor mismatch." });
    }

    res
      .status(200)
      .json({ message: "Donation marked as accepted successfully." });
  });
};

module.exports = markDonationAsAccepted;
