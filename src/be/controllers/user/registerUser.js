/**
 * רישום משתמש חדש
 * תפקיד: קליטת נתוני הרשמה, ולידציה, הבטחת תפקיד ברירת מחדל (Member=2) בלבד,
 *         יצירת משתמש, ושליחת מייל אימות + התראת אדמין (לא חוסם).
 * הערה: אין קבלת role_id מהלקוח — השרת קובע תמיד 2 (Member).
 * דוגמה:
 *   curl -X POST http://localhost:5000/users/register \
 *     -H "Content-Type: application/json" \
 *     -d '{"username":"john","full_name":"John Doe","email":"john@example.com","password":"123456","phonenumber":"0521234567"}'
 */
const db = require("../../utils/db");
const { send500 } = require("../helpers/utils");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { sendRegistration, sendMail } = require("../../utils/mailer");
const { adminNotification } = require("../../templates/emailTemplates");

const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || "http://localhost:3000";
const MEMBER_ROLE_ID = 2;

// ---------- עזרים קצרים ----------
const validateInput = ({ username, phonenumber, full_name, email, password }) =>
  !username || !email || !password || !full_name || !phonenumber ? "Missing required fields." : null;

const checkRoleExists = (roleId) =>
  new Promise((resolve, reject) =>
    db.query("SELECT role_id FROM roles WHERE role_id = ? LIMIT 1", [roleId],
      (err, rows) => (err ? reject(err) : resolve(rows.length > 0)))
  );

const checkUniqueUser = (email, username) =>
  new Promise((resolve, reject) =>
    db.query("SELECT 1 FROM users WHERE email = ? OR username = ? LIMIT 1", [email, username],
      (err, rows) => (err ? reject(err) : resolve(rows.length > 0)))
  );

const hashPassword = (password) =>
  new Promise((resolve, reject) => bcrypt.hash(password, 12, (err, hash) => (err ? reject(err) : resolve(hash))));

// NOTE: סדר העמודות והפרמטרים מתואם (full_name לפני phone_number)
const insertUser = ({ username, hashed, full_name, phonenumber, email, birth_date }) =>
  new Promise((resolve, reject) => {
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const sql = `INSERT INTO users
      (username, password, full_name, phone_number, email, birth_date, role_id, verification_token, is_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`;
    const params = [username, hashed, full_name, phonenumber, email, birth_date || null, MEMBER_ROLE_ID, verificationToken];
    db.query(sql, params, (err, result) => (err ? reject(err) : resolve({ userId: result.insertId, verificationToken })));
  });

const sendEmails = async ({ email, full_name, verificationToken }) => {
  const verifyLink = `${FRONTEND_BASE_URL}/verify?token=${verificationToken}`;
  try { await sendRegistration(email, full_name, verifyLink); } catch (e) { console.error("sendRegistration failed:", e?.message || e); }
  try {
    await sendMail({
      to: process.env.EMAIL_USER,
      subject: "רישום משתמש חדש - Isra-Hand",
      html: adminNotification ? adminNotification(full_name, email) : `<p>New user registered: ${full_name} (${email})</p>`,
    });
  } catch (e) { console.error("admin notify failed:", e?.message || e); }
};

// ---------- הבקר הראשי (קצר) ----------
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

    sendEmails({ email, full_name, verificationToken }).catch(() => {});
    return res.status(201).json({ message: "User registered. Please verify your email.", userId, roleId: MEMBER_ROLE_ID, user_name: username, full_name });
  } catch (err) {
    return send500(res, "Database error (register user)", err);
  }
};

module.exports = registerUser;
