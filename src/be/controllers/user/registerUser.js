// controllers/users/registerUser.js
const db = require("../../utils/db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { sendRegistration, sendMail } = require("../../utils/mailer");

const {
  adminNotification,
} = require("../../templates/emailTemplates");

const registerUser = (req, res) => {
  // Frontend sends multipart/form-data via FormData.
  // Make sure your route uses multer().none() so req.body is populated.
  // Example (in routes): router.post("/register", upload.none(), registerUser);

  const {
    username,
    full_name,
    email,
    password,
    birth_date,
    role_id,
  } = req.body;

  console.log("📩 Incoming signup data:", {
    username,
    full_name,
    email,
    birth_date,
    role_id,
  });

  const roleId = parseInt(role_id, 10);
  if (!roleId || Number.isNaN(roleId)) {
    return res.status(400).json({ error: "Invalid role_id provided." });
  }

  // 1) Validate role exists by ID (matches roles enum table you have)
  const checkRoleSql = "SELECT role_id FROM roles WHERE role_id = ?";
  db.query(checkRoleSql, [roleId], (error, roleResults) => {
    if (error) {
      console.error("❌ Error checking role:", error);
      return res.status(500).json({ error: "Database error (checkRoleSql)" });
    }

    if (roleResults.length === 0) {
      return res.status(400).json({ error: "Invalid role_id provided." });
    }

    // 2) Ensure unique email/username
    const checkUserSql =
      "SELECT 1 FROM users WHERE email = ? OR username = ? LIMIT 1";
    db.query(checkUserSql, [email, username], (error, userResults) => {
      if (error) {
        console.error("❌ Error checking user uniqueness:", error);
        return res
          .status(500)
          .json({ error: "Database error (checkUserSql)" });
      }

      if (userResults.length > 0) {
        return res
          .status(400)
          .json({ error: "Email or username already exists." });
      }

      // 3) Hash password and insert
      bcrypt.hash(password, 12, (err, hashedPassword) => {
        if (err) {
          console.error("❌ Error hashing password:", err);
          return res.status(500).json({ error: "Password hash failed" });
        }

        const verificationToken = crypto.randomBytes(32).toString("hex");
        const insertSql = `
          INSERT INTO users
            (username, full_name, email, password, role_id, birth_date, verification_token)
          VALUES
            (?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
          insertSql,
          [
            username,
            full_name,
            email,
            hashedPassword,
            roleId,
            birth_date, // expecting 'YYYY-MM-DD' from frontend
            verificationToken,
          ],
          async (insertErr, insertRes) => {
            if (insertErr) {
              console.error("❌ Error inserting user:", insertErr);
              return res
                .status(500)
                .json({ error: "Database error (insert user)" });
            }

            const userId = insertRes.insertId;

            // 4) Send verification email (non-blocking)
            const frontendURL =
              process.env.FRONTEND_BASE_URL || "http://localhost:3000";
            const verifyLink = `${frontendURL}/verify?token=${verificationToken}`;

            try {
              await sendRegistration(email, full_name, verifyLink);
              console.log("📧 Verification email sent to", email);
            } catch (mailErr) {
              console.error(
                "❌ Failed to send verification email:",
                mailErr?.message || mailErr
              );
              // We still continue; user can request resend later.
            }

            // 5) Notify admin
            const adminEmail = process.env.EMAIL_USER;
            try {
              await sendMail({
                to: adminEmail,
                subject: "רישום משתמש חדש - Isra-Hand",
                html: adminNotification(full_name, `Role ID: ${roleId}`),
              });
              console.log("📩 Admin notified about new registration");
            } catch (adminErr) {
              console.error("❌ Failed to notify admin:", adminErr?.message || adminErr);
            }

            // 6) Done
            return res.status(201).json({
              message: "User registered. Please verify your email.",
              userId,
              roleId,
              user_name: username,
              full_name,
            });
          }
        );
      });
    });
  });
};

module.exports = registerUser;
