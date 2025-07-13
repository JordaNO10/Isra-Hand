const db = require("../../utils/db");

const deleteCategory = (req, res) => {
  const name = decodeURIComponent(req.params.name);

  const sql = "DELETE FROM categories WHERE category_name = ?";

  db.query(sql, [name], (error, results) => {
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
