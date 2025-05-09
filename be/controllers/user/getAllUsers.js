const db = require("../../utils/db");

const getAllUsers = (req, res) => {
  const sql = `
    SELECT users.*, roles.role_name 
    FROM users 
    JOIN roles ON users.role_id = roles.role_id`;

  db.query(sql, (error, results) => {
    if (error) {
      console.error("Database error while fetching users:", error);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(200).json(results);
  });
};

module.exports = getAllUsers;
