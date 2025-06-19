const db = require("../../utils/db");

const getDonationById = async (req, res) => {
  const { id } = req.params;
  const sql = `
  SELECT 
    donations.*, 
    ratings.user_id AS rating_user_id,
    donations.requestor_id
  FROM donations
  LEFT JOIN ratings ON ratings.donation_id = donations.donation_id
  WHERE donations.donation_id = ?
  LIMIT 1;
`;

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
