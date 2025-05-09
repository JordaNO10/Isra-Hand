const db = require("../../utils/db");

const requestDonation = (req, res) => {
  const donationId = req.params.id;
  const { requestor_id } = req.body;

  const sql = `
    UPDATE donations
    SET requestor_id = ?
    WHERE donation_id = ? AND requestor_id IS NULL
  `;

  db.query(sql, [requestor_id, donationId], (err, result) => {
    if (err) {
      console.error("Error requesting donation:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(409).json({ error: "Donation already requested." });
    }
    res.json({ message: "Donation requested successfully" });
  });
};

module.exports = requestDonation;
