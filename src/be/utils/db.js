/**
 * קובץ חיבור למסד הנתונים (MySQL)
 * תפקיד: יצירת חיבור למסד הנתונים "israhand" באמצעות mysql2,
 *          ובדיקת הצלחת ההתחברות.
 */

const mysql = require("mysql2");

// הגדרת פרטי ההתחברות למסד הנתונים
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "israhand",
});

// ביצוע ניסיון התחברות למסד הנתונים
db.connect((error) => {
  if (error) {
    console.error("חיבור למסד הנתונים נכשל:", error.stack);
    return;
  }
  console.log("החיבור למסד הנתונים הצליח.");
});

// ייצוא החיבור לשימוש בקבצים אחרים
module.exports = db;
