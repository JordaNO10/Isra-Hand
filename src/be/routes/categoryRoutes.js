const express = require("express");
const router = express.Router();

// Import Category Controllers
const getAllCategories = require("../controllers/category/getAllCategories");
const addCategory = require("../controllers/category/addCategory");
const updateCategory = require("../controllers/category/updateCategory");
const deleteCategory = require("../controllers/category/deleteCategory");
const deleteSubCategory = require("../controllers/category/deleteSubCategory");
// Category Routes
router.get("/", getAllCategories); // Get all categories
router.post("/add", addCategory); // Add new category
router.put("/:id", updateCategory); // Update existing category
router.delete("/:name", deleteCategory); // Delete category
router.delete("/sub/:categoryId/:subCategory", deleteSubCategory);
module.exports = router;
