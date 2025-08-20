/**
 * קובץ ראוטים לניהול דירוגים (Ratings)
 * תפקיד: מגדיר את הנתיבים הקשורים לדירוגים ומחבר אותם לפונקציות הבקר (controllers).
 */

const express = require("express");
const router = express.Router();

// יבוא פונקציות הבקר
const addRating = require("../controllers/ratings/addRating");
const getAllRatings = require("../controllers/ratings/getAllRatings");
const getUserRating = require("../controllers/ratings/getUserRating");

// שליפת כל הדירוגים
router.get("/", getAllRatings); 

// שליפת דירוגים לפי מזהה משתמש
router.get("/:userId", getUserRating); 

// הוספת דירוג חדש
router.post("/", addRating); 

// ייצוא הראוטר לשימוש באפליקציה הראשית
module.exports = router;
