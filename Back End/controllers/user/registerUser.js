const db = require('../../utils/db');
const bcrypt = require('bcrypt');

const registerUser = (req, res) => {
  const { username, name, email, password, role, birthdate } = req.body;

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
        return res.status(400).json({ error: "Email or username already exists." });
      }

      bcrypt.hash(password, 12, (err, hashedPassword) => {
        if (err) return res.status(500).json({ error: "Database error" });

        const sql = "INSERT INTO users (username, full_name, email, password, role_id, birth_date) VALUES (?, ?, ?, ?, ?, ?)";
        db.query(sql, [username, name, email, hashedPassword, roleId, birthdate], (error, results) => {
          if (error) return res.status(500).json({ error: "Database error" });

          res.status(201).json({ message: "User created successfully", userId: results.insertId });
        });
      });
    });
  });
};

module.exports = registerUser;
