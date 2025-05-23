const db = require("../../utils/db");

const getDonationById = async (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM donations WHERE donation_id = ?";

  try {
    const [results] = await db.promise().query(sql, [id]);

    if (results.length === 0) {
      return res.status(404).json({ error: "Donation not found" });
    }

    const donation = results[0];

    if (donation.donation_date) {
      donation.donation_date = new Date(donation.donation_date)
        .toISOString()
        .split("T")[0];
    }
    res.status(200).json(results[0]);
  } catch (error) {
    console.error("Error fetching donation:", error);
    res.status(500).json({ error: "Failed to fetch donation" });
  }
};

module.exports = getDonationById;
