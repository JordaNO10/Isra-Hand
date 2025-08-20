/**
 * פונקציה זו מחזירה את כל הדירוגים הקיימים במערכת.
 * הפלט כולל מידע מהטבלת ratings יחד עם שם התרומה מתוך donations.
 */

const db = require("../../utils/db");

const getAllRatings = async (req, res) => {
  const sql = `
    SELECT ratings.*, donations.donation_name
    FROM ratings
    JOIN donations ON ratings.donation_id = donations.donation_id;
  `;

  try {
    const [results] = await db.promise().query(sql);
    res.status(200).json(results);
  } catch (error) {
    console.error("שגיאה בעת שליפת דירוגים:", error);
    res.status(500).json({ error: "Failed to fetch ratings" });
  }
};

module.exports = getAllRatings;
