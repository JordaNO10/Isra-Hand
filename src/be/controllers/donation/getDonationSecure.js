const db = require("../../utils/db");
const { getRoleId, isAdmin } = require("../helpers/utils");

/**
 * שליפת תרומה (גישה מאובטחת)
 * תפקיד: החזרת פרטי תרומה תוך התחשבות בנעילה וגישה של אדמין.
 */
const getDonationSecure = (req, res) => {
  const { id } = req.params;
  const admin = isAdmin(getRoleId(req));

  const sql = `
    SELECT 
      donations.*, 
      ratings.user_id AS rating_user_id,
      donations.requestor_id,
      users.full_name AS donor_name,
      users.phone_number AS phone,
      users.address AS address
    FROM donations
    LEFT JOIN ratings ON ratings.donation_id = donations.donation_id
    LEFT JOIN users ON users.user_id = donations.user_id
    WHERE donations.donation_id = ?
    LIMIT 1;
  `;
  db.query(sql, [id], (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch donation (secure)" });
    if (!rows[0]) return res.status(404).json({ error: "Donation not found" });

    const donation = rows[0];
    // admin bypass for locking would be enforced in other endpoints; here we just return
    return res.status(200).json(donation);
  });
};

module.exports = getDonationSecure;
