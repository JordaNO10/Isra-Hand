const db = require("../../utils/db");

const getAvailableDonations = (req, res) => {
    console.log("sdsf");
    
  const sql = `
    SELECT * FROM donations
    WHERE requestor_id IS NULL
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching available donations:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};

module.exports = getAvailableDonations;
