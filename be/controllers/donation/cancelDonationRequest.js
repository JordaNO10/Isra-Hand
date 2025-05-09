const db = require("../../utils/db");

const cancelDonationRequest = (req, res) => {
  const donationId = req.params.id;
  const { requestor_id } = req.body;

  const sql = `
    UPDATE donations
    SET requestor_id = NULL
    WHERE donation_id = ? AND requestor_id = ?
  `;

  db.query(sql, [donationId, requestor_id], (err, result) => {
    if (err) {
      console.error("Error canceling request:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res
        .status(403)
        .json({ error: "Not allowed to cancel this request" });
    }
    res.json({ message: "Request canceled successfully" });
  });
};

module.exports = cancelDonationRequest;
