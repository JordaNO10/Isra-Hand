/**
 * פונקציה זו מחזירה את כל התרומות שמשתמש מסוים (מבקש) קיבל בפועל.
 * הפלט כולל פרטי תרומה, קטגוריה, תורם, ומידע על דירוג אם קיים.
 */

const db = require("../../utils/db");

const getRequestorAcceptedDonations = async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ error: "Missing user ID" });
  }

  const sql = `
    SELECT 
      donations.*, 
      categories.category_name,
      categories.sub_category,
      users.full_name AS donor_name,
      users.phone_number AS phone,
      users.email AS email,
      users.address AS address,
      ratings.user_id AS rating_user_id
    FROM donations
    JOIN categories ON categories.category_id = donations.category_id
    LEFT JOIN users ON users.user_id = donations.user_id
    LEFT JOIN ratings ON ratings.donation_id = donations.donation_id
    WHERE donations.requestor_id = ? AND donations.accepted = 1;
  `;

  try {
    const [results] = await db.promise().query(sql, [userId]);
    res.status(200).json(results);
  } catch (err) {
    console.error("שגיאת SQL בשליפת תרומות מאושרות למבקש:", err);
    res.status(500).json({ error: "Database query failed" });
  }
};

module.exports = getRequestorAcceptedDonations;
