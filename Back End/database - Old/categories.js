const express = require("express");
const router = express.Router();
const connection = require("./connection.js"); // Adjust path as needed

// Function to get the current ENUM values for category_name
const getCurrentEnumValues = (callback) => {
  const sql = "SHOW COLUMNS FROM categories LIKE 'category_name'";
  connection.query(sql, (error, results) => {
    if (error) {
      console.error("Database error while fetching ENUM values:", error);
      return callback(error);
    }

    if (results.length === 0) {
      return callback(new Error("Category name column not found"));
    }

    // Extract the ENUM values from the column definition
    const enumValues = results[0].Type.replace(/enum\((.*)\)/, "$1")
      .split(",")
      .map((value) => value.replace(/'/g, "").trim());

    callback(null, enumValues);
  });
};

// Function to add a new ENUM value to the category_name column
const addEnumValue = (newValue, currentValues, callback) => {
  // Combine current ENUM values with the new value
  const updatedEnum = [...currentValues, newValue]
    .map((value) => `'${value}'`)
    .join(", ");
  const sql = `ALTER TABLE categories MODIFY category_name ENUM(${updatedEnum})`;

  connection.query(sql, (error) => {
    if (error) {
      console.error("Database error while adding ENUM value:", error);
      return callback(error);
    }
    callback(null);
  });
};

// GET /categories - Get all categories
router.get("/", (req, res) => {
  const sql = "SELECT * FROM categories";
  connection.query(sql, (error, results) => {
    if (error) {
      console.error("Database error while fetching categories:", error);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results);
  });
});

// POST /categories - Create a new category
router.post("/", (req, res) => {
  const { category_name } = req.body;

  if (!category_name || !category_name.trim()) {
    return res.status(400).json({ error: "Category name is required" });
  }

  getCurrentEnumValues((error, enumValues) => {
    if (error) {
      return res.status(500).json({ error: "Failed to retrieve ENUM values" });
    }

    // Check if the category_name already exists in ENUM values
    if (enumValues.includes(category_name)) {
      return res.status(400).json({ error: "Category name already exists" });
    }

    // If not, add the new ENUM value
    const newEnumValue = category_name; // No need to prepare for SQL yet
    addEnumValue(newEnumValue, enumValues, (error) => {
      if (error) {
        return res.status(500).json({ error: "Failed to add ENUM value" });
      }

      // Now insert the new category
      const sql = "INSERT INTO categories (category_name) VALUES (?)";
      connection.query(sql, [category_name], (error, results) => {
        if (error) {
          console.error("Database error while creating category:", error);
          return res.status(500).json({ error: "Database error" });
        }

        // Return the newly created category with its ID
        const newCategory = {
          category_id: results.insertId,
          category_name: category_name,
        };

        res.status(201).json(newCategory);
      });
    });
  });
});

// PUT /categories/:id - Update category information by ID
router.put("/:id", (req, res) => {
  const categoryId = req.params.id;
  const { category_name } = req.body;

  console.log("PUT /categories/:id endpoint hit");
  console.log("Update request - ID:", categoryId, "New name:", category_name);

  if (!category_name || !category_name.trim()) {
    return res.status(400).json({ error: "Category name is required" });
  }

  getCurrentEnumValues((error, enumValues) => {
    if (error) {
      return res.status(500).json({ error: "Failed to retrieve ENUM values" });
    }

    // Check if the category_name already exists in ENUM values
    if (!enumValues.includes(category_name)) {
      const newEnumValue = category_name; // No need to prepare for SQL yet
      addEnumValue(newEnumValue, enumValues, (error) => {
        if (error) {
          return res.status(500).json({ error: "Failed to add ENUM value" });
        }
      });
    }

    const sql = "UPDATE categories SET category_name = ? WHERE category_id = ?";
    connection.query(sql, [category_name, categoryId], (error, results) => {
      if (error) {
        console.error("Database error while updating category:", error);
        return res
          .status(500)
          .json({ error: "Database error", details: error.message });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Category not found." });
      }

      const updatedCategory = {
        category_id: categoryId,
        category_name: category_name,
      };

      res.status(200).json(updatedCategory);
    });
  });
});

// DELETE /categories/:id - Delete a category by ID
router.delete("/:id", (req, res) => {
  const categoryId = req.params.id;

  const sql = "DELETE FROM categories WHERE category_id = ?";
  connection.query(sql, [categoryId], (error, results) => {
    if (error) {
      console.error("Database error while deleting category:", error);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Category not found." });
    }

    res.status(200).json({ message: "Category deleted successfully." });
  });
});

module.exports = router;
