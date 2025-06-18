const db = require("../../utils/db");

// Helper functions (like in addCategory)
const getCurrentEnumValues = (callback) => {
  const sql = "SHOW COLUMNS FROM categories LIKE 'category_name'";
  db.query(sql, (error, results) => {
    if (error) return callback(error, null);

    if (results.length === 0) {
      return callback(new Error("Category name column not found"), null);
    }

    const enumValues = results[0].Type.replace(/enum\((.*)\)/, "$1")
      .split(",")
      .map((value) => value.replace(/'/g, "").trim());

    callback(null, enumValues);
  });
};

const addEnumValue = (newValue, currentValues, callback) => {
  const updatedEnum = [...currentValues, newValue]
    .map((value) => `'${value}'`)
    .join(", ");
  const sql = `ALTER TABLE categories MODIFY category_name ENUM(${updatedEnum})`;

  db.query(sql, (error) => {
    if (error) return callback(error);
    callback(null);
  });
};

const updateCategory = (req, res) => {
  const { id } = req.params;
  const { category_name } = req.body;

  if (!category_name || !category_name.trim()) {
    return res.status(400).json({ error: "Category name is required" });
  }

  getCurrentEnumValues((error, enumValues) => {
    if (error) {
      console.error("Error fetching enum values:", error);
      return res.status(500).json({ error: "Failed to retrieve ENUM values" });
    }

    if (!enumValues.includes(category_name)) {
      addEnumValue(category_name, enumValues, (error) => {
        if (error) {
          console.error("Error adding enum value:", error);
          return res.status(500).json({ error: "Failed to add ENUM value" });
        }
      });
    }

    const sql = "UPDATE categories SET category_name = ? WHERE category_id = ?";
    db.query(sql, [category_name, id], (error, results) => {
      if (error) {
        console.error("Database error while updating category:", error);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Category not found." });
      }

      const updatedCategory = {
        category_id: id,
        category_name: category_name,
      };

      res.status(200).json(updatedCategory);
    });
  });
};

module.exports = updateCategory;
