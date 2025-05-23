const express = require("express");
const router = express.Router();

// Import Category Controllers
// const getAllRatings = require("../controllers/ratings/addRating");
const addRating = require("../controllers/ratings/addRating");
const getAllRatings = require("../controllers/ratings/getAllRatings");
// Category Routes
router.get("/", getAllRatings); // Get all categories
router.post("/", addRating); // Add new category

module.exports = router;
