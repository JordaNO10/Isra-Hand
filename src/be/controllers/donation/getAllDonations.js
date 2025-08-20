/**
 * פונקציה זו מחזירה את כל התרומות ממסד הנתונים עם מידע משלים:
 * קטגוריה, תת־קטגוריה, ופרטי התורם. 
 * תומכת במגבלת שליפה (limit) ודילוג (offset).
 */

const { q, send500 } = require("../helpers/utils");

// שאילתת SQL בסיסית עם הצטרפות לקטגוריות ולמשתמשים
const buildSQL = () => `
  SELECT d.*, 
         c.category_name, 
         c.sub_category,
         u.full_name AS donor_name, 
         u.phone_number AS phone, 
         u.email, 
         u.address
  FROM donations d
  LEFT JOIN categories c ON c.category_id = d.category_id
  LEFT JOIN users u ON u.user_id = d.user_id
  LIMIT ? OFFSET ?
`;

const getAllDonations = async (req, res) => {
  const limit = parseInt(req.query.limit) || 25;
  const offset = parseInt(req.query.offset) || 0;

  try {
    const [rows] = await q(buildSQL(), [limit, offset]);
    res.status(200).json(rows);
  } catch (err) {
    send500(res, "Failed to fetch donations", err);
  }
};

module.exports = getAllDonations;
