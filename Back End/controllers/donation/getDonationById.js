const db = require("../../utils/db");

const getDonationById = async (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM donations WHERE donation_id = ?";

  try {
    const [results] = await db.promise().query(sql, [id]);

    if (results.length === 0) {
      return res.status(404).json({ error: "Donation not found" });
    }

    res.status(200).json(results[0]);
  } catch (error) {
    console.error("Error fetching donation:", error);
    res.status(500).json({ error: "Failed to fetch donation" });
  }
};

module.exports = getDonationById;
