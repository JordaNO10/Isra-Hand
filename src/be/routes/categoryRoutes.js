/**
 * קובץ זה אחראי על ניהול הנתיבים (Routes) של קטגוריות ותתי־קטגוריות:
 * - שליפת כל הקטגוריות
 * - הוספת קטגוריה חדשה
 * - עדכון קטגוריה קיימת
 * - מחיקת קטגוריה לפי שם
 * - מחיקת תת־קטגוריה מתוך קטגוריה
 */

const express = require("express");
const router = express.Router();

// ייבוא בקרי קטגוריות
const getAllCategories = require("../controllers/category/getAllCategories");
const addCategory = require("../controllers/category/addCategory");
const updateCategory = require("../controllers/category/updateCategory");
const deleteCategory = require("../controllers/category/deleteCategory");
const deleteSubCategory = require("../controllers/category/deleteSubCategory");

// נתיבי קטגוריות
router.get("/", getAllCategories);          // שליפת כל הקטגוריות
router.post("/add", addCategory);           // הוספת קטגוריה חדשה
router.put("/:id", updateCategory);         // עדכון קטגוריה קיימת לפי מזהה
router.delete("/:name", deleteCategory);    // מחיקת קטגוריה לפי שם
router.delete("/sub/:categoryId/:subCategory", deleteSubCategory); // מחיקת תת־קטגוריה

module.exports = router;
