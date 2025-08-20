/**
 * קובץ שרת ראשי (server.js)
 * תפקיד: הגדרת אפליקציית Express, חיבור Middleware (אבטחה, לוגים, סשנים, CORS),
 *          יצירת תיקיית העלאות, חיבור ראוטים, והפעלת השרת.
 */

const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const sessionMiddleware = require("./config/session");
const dotenv = require("dotenv");
const cors = require("cors");
require("./controllers/schedule/cron");

//  ייבוא ראוטים
const userRoutes = require("./routes/userRoutes");
const donationRoutes = require("./routes/donationRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const ratingRoutes = require("./routes/ratingsRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// הגדרת CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// בדיקה ויצירת תיקיית העלאות אם לא קיימת
const uploadDirectory = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// טעינת משתני סביבה
dotenv.config();

// אבטחה ולוגים
app.use(helmet());
app.use(morgan("combined"));

// פריסת JSON
app.use(express.json());

// סשנים
sessionMiddleware(app);

// קבצים סטטיים (uploads)
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "same-site");
    next();
  },
  express.static(path.join(__dirname, "uploads"))
);

// נתיבים
app.use("/users", userRoutes);       // הרשמה, התחברות, יציאה
app.use("/donations", donationRoutes); // תרומות (הוספה, עדכון, מחיקה)
app.use("/categories", categoryRoutes); // קטגוריות
app.use("/ratings", ratingRoutes);     // דירוגים

// טיפול בשגיאות גלובלי
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "משהו השתבש בשרת." });
});

// הפעלת השרת
app.listen(PORT, () => {
  console.log(`✅ השרת רץ בהצלחה על פורט ${PORT}`);
});
