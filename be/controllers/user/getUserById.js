const db = require('../../utils/db');

const getUserById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT users.*, roles.role_name
    FROM users 
    JOIN roles ON users.role_id = roles.role_id
    WHERE users.user_id = ?`;

  db.query(sql, [id], (error, results) => {
    if (error) {
      console.error("Database error while fetching user:", error);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(results[0]);
  });
};

module.exports = getUserById;
