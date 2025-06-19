const db = require("../../utils/db");

const getAvailableDonations = (req, res) => {
  const sql = `
    SELECT 
    d.*, 
    c.category_name,
    c.sub_category,
    u.full_name AS donor_name,
    u.phone_number AS phone,
    u.address AS address
  FROM 
    donations d
  JOIN 
    categories c ON c.category_id = d.category_id
  LEFT JOIN 
    users u ON u.user_id = d.user_id
  WHERE 
    d.requestor_id IS NULL
    ORDER BY 
      d.donation_date DESC;
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
