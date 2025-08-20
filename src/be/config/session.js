/**
 * קובץ זה אחראי על ניהול סשנים (Session) באפליקציה באמצעות express-session,
 * כאשר הנתונים נשמרים בבסיס נתונים MySQL לצורך שרידות, ניהול תוקף וניקוי אוטומטי.
 * בנוסף מוגדרות עוגיות (Cookies) בצד לקוח עם בקרות אבטחה ותוקף זמן.
 */

const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const cookieParser = require("cookie-parser");

/**
 * אפשרויות הגדרת ה-Session Store בבסיס הנתונים:
 * - clearExpired: מנקה סשנים שפג תוקפם.
 * - rolling: מחדש את העוגייה בכל בקשה (מאריך את חיי הסשן).
 * - checkExpirationInterval: תדירות הניקוי (במיליסקונד).
 * - expiration: משך חיי סשן בצד השרת (במיליסקונד).
 */
const options = {
  host: "localhost",
  user: "root",
  password: "",
  database: "israhand",
  clearExpired: true,
  rolling: true,
  checkExpirationInterval: 900000, // 15 דקות
  expiration: 3600000, // 1 שעה
};

const sessionStore = new MySQLStore(options);

/**
 * Middleware לניהול סשנים:
 * - מוסיף תמיכה בעוגיות.
 * - מגדיר את מנגנון הסשן עם שמירה ב-MySQL.
 * - קובע פרמטרים של אבטחה ותוקף עבור ה-Cookie.
 */
const sessionMiddleware = (app) => {
  app.use(cookieParser());

  app.use(
    session({
      key: "session_id",
      secret: "Session Key", // מומלץ להחזיק במשתני סביבה
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true, // מונע גישה ע"י JS בצד לקוח
        secure: false, // בפרודקשן יש לשנות ל-true (דורש HTTPS)
        maxAge: 3600000, // 1 שעה תוקף עוגייה
      },
    })
  );
};

module.exports = sessionMiddleware;
