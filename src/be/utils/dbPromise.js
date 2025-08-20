/**
 * קובץ חיבור למסד הנתונים (MySQL) באמצעות Promise API
 * תפקיד: יצירת Pool של חיבורים למסד הנתונים "israhand",
 *          המאפשר עבודה אסינכרונית ויעילה יותר עם מספר חיבורים בו-זמנית.
 */

// שימוש ב- mysql2 עם תמיכה ב-Promise
const mysql = require("mysql2/promise");

// יצירת Pool של חיבורים למסד הנתונים
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "israhand",
  waitForConnections: true, // ממתין אם אין חיבורים זמינים
  connectionLimit: 10,      // מספר מקסימלי של חיבורים במקביל
  queueLimit: 0,            // ללא הגבלה על מספר הבקשות בתור
});

// ייצוא החיבור לשימוש בקבצים אחרים
module.exports = db;
