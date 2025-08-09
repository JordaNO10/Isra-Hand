const { q, send500 } = require("../helpers/utils");

const buildSQL = () => `
  SELECT d.*, c.category_name, c.sub_category,
         u.full_name AS donor_name, u.phone_number AS phone, u.address AS address
  FROM donations d
  JOIN categories c ON c.category_id = d.category_id
  LEFT JOIN users u ON u.user_id = d.user_id
  WHERE d.requestor_id IS NULL
  ORDER BY d.donation_date DESC
`;

const getAvailableDonations = async (_req, res) => {
  try { const [rows] = await q(buildSQL()); res.json(rows); }
  catch (err) { send500(res, "Database error while fetching available donations", err); }
};

module.exports = getAvailableDonations;