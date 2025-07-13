const db = require("../../utils/db");

const updateCategory = (req, res) => {
  const { id } = req.params;
  const { category_name, sub_category, catg_photo, sub_category_old } =
    req.body;

  if (!category_name || !category_name.trim()) {
    return res.status(400).json({ error: "Category name is required" });
  }

  const name = category_name.trim();
  const sub = sub_category?.trim() || null;
  const photo = catg_photo?.trim() || null;

  const sql = `
  UPDATE categories 
  SET category_name = ?, sub_category = ?, catg_photo = ? 
  WHERE category_id = ? AND sub_category = ?
`;

  db.query(sql, [name, sub, photo, id, sub_category_old], (error, results) => {
    if (error) {
      console.error("Database error while updating category:", error);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Category not found." });
    }

    res.status(200).json({
      category_id: id,
      category_name: name,
      sub_category: sub,
      catg_photo: photo,
    });
  });
};

module.exports = updateCategory;
