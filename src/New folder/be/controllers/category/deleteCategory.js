const db = require("../../utils/db");

const deleteCategory = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM categories WHERE category_id = ?";

  db.query(sql, [id], (error, results) => {
    if (error) {
      console.error("Database error while deleting category:", error);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Category not found." });
    }

    res.status(200).json({ message: "Category deleted successfully." });
  });
};

module.exports = deleteCategory;
