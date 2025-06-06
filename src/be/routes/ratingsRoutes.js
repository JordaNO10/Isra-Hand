const express = require("express");
const router = express.Router();

const addRating = require("../controllers/ratings/addRating");
const getAllRatings = require("../controllers/ratings/getAllRatings");
const getUserRating = require("../controllers/ratings/getUserRating");

// ✅ Order matters here!
router.get("/", getAllRatings); // GET /ratings
router.get("/:userId", getUserRating); // GET /ratings/:userId
router.post("/", addRating); // POST /ratings

module.exports = router;
