/**
 * קובץ זה מגדיר את מנגנון העלאת הקבצים באמצעות multer.
 * תפקיד: לשמור קבצים בתיקיית `uploads` עם שם ייחודי, לבדוק סוג וגודל קובץ.
 */

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// יצירת תיקיית uploads במידה ואינה קיימת
const uploadDirectory = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// הגדרות אחסון לקובץ: תיקייה + שם ייחודי
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// אתחול multer עם מגבלת גודל ובדיקת סוגי קבצים
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // מקסימום 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const isValid =
      allowedTypes.test(file.mimetype) &&
      allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (isValid) {
      cb(null, true);
    } else {
      cb(new Error("שגיאה: סוג קובץ לא תקין!"));
    }
  },
});

// ייצוא middleware לשימוש בקבצים אחרים
module.exports = upload;
