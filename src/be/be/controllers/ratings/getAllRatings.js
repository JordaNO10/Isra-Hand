const db = require("../../utils/db");

const getAllRatings = async (req, res) => {
  const sql = `
  SELECT ratings.*, donations.donation_name
  FROM ratings
  JOIN donations ON ratings.donation_id = donations.donation_id;
`;

  try {
    const [results] = await db.promise().query(sql);
    const donation = results[0];

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ error: "Failed to fetch donations" });
  }
};

module.exports = getAllRatings;
