const db = require("../../utils/db");

const getAllDonations = async (req, res) => {
  const limit = parseInt(req.query.limit) || 25;
  const offset = parseInt(req.query.offset) || 0;

  const sql = `
    SELECT 
      donations.*, 
      categories.category_name,
      categories.sub_category,
      users.full_name AS donor_name,
      users.phone_number AS phone,
      users.email AS email,
      users.address AS address
    FROM donations
    JOIN categories ON categories.category_id = donations.category_id
    LEFT JOIN users ON users.user_id = donations.user_id
    LIMIT ? OFFSET ?;
  `;

  try {
    const [results] = await db.promise().query(sql, [limit, offset]);

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ error: "Failed to fetch donations" });
  }
};

module.exports = getAllDonations;
