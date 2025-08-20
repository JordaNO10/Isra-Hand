/**
 * קובץ זה אחראי על רישום משתמש חדש במערכת:
 * - קליטת נתוני הרשמה ובדיקת תקינותם
 * - הבטחת תפקיד ברירת מחדל (Member = 2) בלבד
 * - בדיקת ייחודיות אימייל ושם משתמש
 * - הצפנת סיסמה והכנסת משתמש למסד הנתונים
 * - שליחת מייל אימות למשתמש חדש והתראת אדמין
 */

const db = require("../../utils/db");
const { send500 } = require("../helpers/utils");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { sendRegistration, sendMail } = require("../../utils/mailer");
const { adminNotification } = require("../../templates/emailTemplates");

const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || "http://localhost:3000";
const MEMBER_ROLE_ID = 2;

/**
 * בדיקת נתוני קלט (חובה)
 */
const validateInput = ({ username, phonenumber, full_name, email, password }) =>
  !username || !email || !password || !full_name || !phonenumber ? "Missing required fields." : null;

/**
 * בדיקה שקיים Role ברירת מחדל במסד הנתונים
 */
const checkRoleExists = (roleId) =>
  new Promise((resolve, reject) =>
    db.query("SELECT role_id FROM roles WHERE role_id = ? LIMIT 1", [roleId],
      (err, rows) => (err ? reject(err) : resolve(rows.length > 0)))
  );

/**
 * בדיקה האם קיים משתמש עם אותו אימייל או שם משתמש
 */
const checkUniqueUser = (email, username) =>
  new Promise((resolve, reject) =>
    db.query("SELECT 1 FROM users WHERE email = ? OR username = ? LIMIT 1", [email, username],
      (err, rows) => (err ? reject(err) : resolve(rows.length > 0)))
  );

/**
 * הצפנת סיסמה באמצעות bcrypt
 */
const hashPassword = (password) =>
  new Promise((resolve, reject) => bcrypt.hash(password, 12, (err, hash) => (err ? reject(err) : resolve(hash))));

/**
 * הכנסת משתמש חדש למסד הנתונים
 */
const insertUser = ({ username, hashed, full_name, phonenumber, email, birth_date }) =>
  new Promise((resolve, reject) => {
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const sql = `INSERT INTO users
      (username, password, full_name, phone_number, email, birth_date, role_id, verification_token, is_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`;
    const params = [username, hashed, full_name, phonenumber, email, birth_date || null, MEMBER_ROLE_ID, verificationToken];
    db.query(sql, params, (err, result) => (err ? reject(err) : resolve({ userId: result.insertId, verificationToken })));
  });

/**
 * שליחת מייל אימות למשתמש + התראת אדמין
 */
const sendEmails = async ({ email, full_name, verificationToken }) => {
  const verifyLink = `${FRONTEND_BASE_URL}/verify?token=${verificationToken}`;
  try {
    await sendRegistration(email, full_name, verifyLink);
  } catch (e) {
    console.error("sendRegistration failed:", e?.message || e);
  }
  try {
    await sendMail({
      to: process.env.EMAIL_USER,
      subject: "רישום משתמש חדש - Isra-Hand",
      html: adminNotification ? adminNotification(full_name, email) : `<p>New user registered: ${full_name} (${email})</p>`,
    });
  } catch (e) {
    console.error("admin notify failed:", e?.message || e);
  }
};

/**
 * בקר רישום משתמש חדש
 * @param {Object} req - בקשת HTTP עם נתוני הרשמה
 * @param {Object} res - תגובת HTTP
 */
const registerUser = async (req, res) => {
  const { username, full_name, email, password, birth_date, phonenumber } = req.body;
  const errMsg = validateInput({ username, phonenumber, full_name, email, password });
  if (errMsg) return res.status(400).json({ error: errMsg });

  try {
    const roleOk = await checkRoleExists(MEMBER_ROLE_ID);
    if (!roleOk) return res.status(500).json({ error: "Role 2 (Member) not found in DB." });

    const exists = await checkUniqueUser(email, username);
    if (exists) return res.status(400).json({ error: "Email or username already exists." });

    const hashed = await hashPassword(password);
    const { userId, verificationToken } = await insertUser({ username, hashed, full_name, phonenumber, email, birth_date });

    // שליחת מיילים (לא חוסם את ההרשמה)
    sendEmails({ email, full_name, verificationToken }).catch(() => {});

    return res.status(201).json({
      message: "User registered. Please verify your email.",
      userId,
      roleId: MEMBER_ROLE_ID,
      user_name: username,
      full_name,
    });
  } catch (err) {
    return send500(res, "שגיאת מסד נתונים (register user)", err);
  }
};

module.exports = registerUser;
