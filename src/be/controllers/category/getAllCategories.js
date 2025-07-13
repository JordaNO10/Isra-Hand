const db = require("../../utils/db");

const getAllCategories = (req, res) => {
  const sql = `
    SELECT 
      category_id,
      category_name,
      sub_category
    FROM categories
    ORDER BY category_name, sub_category;
  `;

  db.query(sql, (error, results) => {
    if (error) {
      console.error("Database error while fetching categories:", error);
      return res.status(500).json({ error: "Database error" });
    }

    // Group by category_name and keep full category_id per sub
    const grouped = {};
    let groupCounter = 1;

    results.forEach((row) => {
      const { category_name, sub_category, category_id } = row;

      if (!grouped[category_name]) {
        grouped[category_name] = {
          group_id: groupCounter++,
          category_name,
          subCategories: [],
        };
      }

      if (sub_category && sub_category.trim() !== "") {
        grouped[category_name].subCategories.push({
          sub_category,
          category_id,
        });
      }
    });

    res.status(200).json(Object.values(grouped));
  });
};

module.exports = getAllCategories;
