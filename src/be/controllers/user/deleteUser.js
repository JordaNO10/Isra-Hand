const db = require("../../utils/db");

const deleteUser = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM users WHERE user_id = ?";

  db.query(sql, [id], (error, results) => {
    if (error) {
      console.error("Database error while deleting user:", error);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  });
};

module.exports = deleteUser;
