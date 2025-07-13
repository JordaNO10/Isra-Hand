const db = require("../../utils/db");

const deleteSubCategory = (req, res) => {
  const categoryId = req.params.categoryId;
  const subCategory = decodeURIComponent(req.params.subCategory);

  const sql =
    "DELETE FROM categories WHERE category_id = ? AND sub_category = ?";

  db.query(sql, [categoryId, subCategory], (error, results) => {
    if (error) {
      console.error("Database error while deleting sub-category:", error);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Sub-category not found." });
    }

    res.status(200).json({ message: "Sub-category deleted successfully." });
  });
};

module.exports = deleteSubCategory;
