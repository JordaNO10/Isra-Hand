const db = require("../../utils/db");

const addCategory = (req, res) => {
  const { category_name, sub_category, catg_photo } = req.body;

  if (!category_name || !category_name.trim()) {
    return res.status(400).json({ error: "Category name is required" });
  }

  // ננקה ערכים
  const name = category_name.trim();
  const sub = sub_category?.trim() || null;
  const photo = catg_photo?.trim() || null;

  // בדיקה אם כבר קיימת אותה קטגוריה עם אותה תת-קטגוריה
  const checkSql = `
    SELECT * FROM categories 
    WHERE category_name = ? AND 
          (sub_category ${sub ? "= ?" : "IS NULL"})
  `;

  const params = sub ? [name, sub] : [name];

  db.query(checkSql, params, (checkErr, results) => {
    if (checkErr) {
      console.error("Error checking existing category:", checkErr);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length > 0) {
      return res
        .status(400)
        .json({ error: "Category and sub-category already exist" });
    }

    // הכנסת הקטגוריה
    const insertSql = `
      INSERT INTO categories (category_name, sub_category, catg_photo) 
      VALUES (?, ?, ?)
    `;

    db.query(insertSql, [name, sub, photo], (insertErr, result) => {
      if (insertErr) {
        console.error("Error inserting category:", insertErr);
        return res.status(500).json({ error: "Failed to add category" });
      }

      res.status(201).json({
        category_id: result.insertId,
        category_name: name,
        sub_category: sub,
        catg_photo: photo,
      });
    });
  });
};

module.exports = addCategory;
