const db = require("../../utils/db");

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

    const user = results[0];

    //  fromat the birthdate to be Year-month-day
    if (user.birth_date) {
      user.birth_date = new Date(user.birth_date).toISOString().split("T")[0];
    }
    if (user.last_login) {
      const date = new Date(user.last_login);
      const yyyy = date.getFullYear();
      const MM = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      const hh = String(date.getHours()).padStart(2, "0");
      const mm = String(date.getMinutes()).padStart(2, "0");
      const ss = String(date.getSeconds()).padStart(2, "0");

      user.last_login = `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
    }

    res.status(200).json(user);
  });
};

module.exports = getUserById;
