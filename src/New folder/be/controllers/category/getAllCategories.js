const db = require("../../utils/db");

const getAllCategories = (req, res) => {
  const sql = `
  SELECT 
  MIN(category_id) AS category_id,
  category_name, 
  GROUP_CONCAT(DISTINCT TRIM(sub_category) SEPARATOR ',') AS subcategories 
FROM categories 
WHERE sub_category IS NOT NULL AND TRIM(sub_category) != '' 
GROUP BY category_name;
  `;

  db.query(sql, (error, results) => {
    if (error) {
      console.error("Database error while fetching categories:", error);
      return res.status(500).json({ error: "Database error" });
    }

    const formatted = results.map((row) => ({
      category_id: row.category_id,
      category_name: row.category_name,
      subCategories: row.subcategories
        ? row.subcategories.split(",").map((s) => s.trim())
        : [],
    }));
    res.status(200).json(formatted);
  });
};

module.exports = getAllCategories;
