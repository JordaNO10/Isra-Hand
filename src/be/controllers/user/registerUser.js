const db = require("../../utils/db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { sendRegistration, sendMail } = require("../../utils/mailer");

const {
  adminNotification,
  registrationThankYou,
  registrationVerificationTemplate,
} = require("../../templates/emailTemplates");

const registerUser = (req, res) => {
  let { username, name, email, password, role, birthdate } = req.body;
  role = parseInt(role);

  const checkRoleSql = "SELECT role_id FROM roles WHERE role_name = ?";
  db.query(checkRoleSql, [role], (error, results) => {
    if (error) return res.status(500).json({ error: "Database error" });

    if (results.length === 0) {
      return res.status(400).json({ error: "Invalid role provided." });
    }

    const roleId = results[0].role_id;
    const checkUserSql = "SELECT * FROM users WHERE email = ? OR username = ?";
    db.query(checkUserSql, [email, username], (error, results) => {
      if (error) return res.status(500).json({ error: "Database error" });

      if (results.length > 0) {
        return res
          .status(400)
          .json({ error: "Email or username already exists." });
      }

      bcrypt.hash(password, 12, (err, hashedPassword) => {
        if (err) return res.status(500).json({ error: "Database error" });

        const verificationToken = crypto.randomBytes(32).toString("hex");
        const insertSql = `
          INSERT INTO users (username, full_name, email, password, role_id, birth_date, verification_token)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
          insertSql,
          [
            username,
            name,
            email,
            hashedPassword,
            roleId,
            birthdate,
            verificationToken,
          ],
          async (error, results) => {
            if (error) return res.status(500).json({ error: "Database error" });

            const userId = results.insertId;

            // ✉️ Send email verification to user
            // ✉️ Send email verification to user
            const frontendURL =
              process.env.FRONTEND_BASE_URL || "http://localhost:3000";
            const verifyLink = `${frontendURL}/verify?token=${verificationToken}`;

            try {
              await sendRegistration(email, name, verifyLink);
              console.log("📧 Verification email sent to", email);
            } catch (err) {
              console.error(
                "❌ Failed to send verification email:",
                err.message
              );
            }

            // ✅ Send admin notification
            const adminEmail = process.env.EMAIL_USER;
            const roleText =
              typeof role === "string" ? role : `Role ID: ${role}`;
            const adminMessage = adminNotification(name, roleText);

            try {
              await sendMail({
                to: adminEmail,
                subject: "רישום משתמש חדש - Isra-Hand",
                html: adminMessage,
              });
              console.log("📩 Admin notified about new registration");
            } catch (adminErr) {
              console.error("❌ Failed to notify admin:", adminErr.message);
            }

            res.status(201).json({
              message: "User registered. Please verify your email.",
              userId,
              roleId,
              user_name: username,
              full_name: name,
            });
          }
        );
      });
    });
  });
};

module.exports = registerUser;
