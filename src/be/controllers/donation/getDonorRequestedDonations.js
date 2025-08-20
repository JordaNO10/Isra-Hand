/**
 * פונקציה זו מחזירה את כל התרומות של תורם מסוים שנבחרו ע"י מבקשים.
 * הפלט כולל פרטי תרומה, קטגוריה, ופרטי המבקש (אם קיים).
 */

const db = require("../../utils/db");

const getDonorRequestedDonations = async (req, res) => {
  const donorId = req.params.id;

  if (!donorId) {
    return res.status(400).json({ error: "Missing donor ID" });
  }

  const sql = `
    SELECT 
      donations.*, 
      categories.category_name,
      categories.sub_category,
      requestors.full_name AS requestor_name,
      requestors.phone_number AS requestor_phone,
      requestors.email AS requestor_email,
      requestors.address AS requestor_address
    FROM donations
    JOIN categories ON categories.category_id = donations.category_id
    LEFT JOIN users AS requestors ON requestors.user_id = donations.requestor_id
    WHERE donations.user_id = ? AND donations.requestor_id IS NOT NULL;
  `;

  try {
    const [results] = await db.promise().query(sql, [donorId]);
    res.status(200).json(results);
  } catch (err) {
    console.error("שגיאה בשליפת תרומות של תורם עם מבקשים:", err);
    res.status(500).json({ error: "Database query failed" });
  }
};

module.exports = getDonorRequestedDonations;
