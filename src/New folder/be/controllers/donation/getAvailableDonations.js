const db = require("../../utils/db");

const getAvailableDonations = (req, res) => {
  const sql = `
    SELECT 
  d.*, 
  c.category_name 
FROM 
  donations d
JOIN 
  categories c ON d.category_id = c.category_id
WHERE 
  d.requestor_id IS NULL;
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
