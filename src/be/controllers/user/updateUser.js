const db = require("../../utils/db");
const { normalizeRoleId } = require("../helpers/utils");

/**
 * עדכון משתמש
 * תפקיד המחלקה: עדכון שדות משתמש באופן דינמי.
 * שינוי לפרויקט: נרמול role_id (3 -> 2) לפני עדכון.
 * דוגמת הרצה:
 *   curl -X PUT http://localhost:5000/users/55 -H "Content-Type: application/json" -d "{\"role_id\":3,\"full_name\":\"Admin Jordan\"}"
 */
const updateUser = (req, res) => {
  const { id } = req.params;
  const { username, full_name, role_id, email, birth_date, address, phone_number } = req.body;

  const normalizedRoleId = typeof role_id !== "undefined" ? normalizeRoleId(role_id) : undefined;

  const updates = [];
  const values = [];
  if (typeof normalizedRoleId !== "undefined") { updates.push("role_id = ?"); values.push(normalizedRoleId); }
  if (username !== undefined) { updates.push("username = ?"); values.push(username); }
  if (full_name !== undefined) { updates.push("full_name = ?"); values.push(full_name); }
  if (email !== undefined) { updates.push("email = ?"); values.push(email); }
  if (birth_date !== undefined) { updates.push("birth_date = ?"); values.push(birth_date); }
  if (address !== undefined) { updates.push("address = ?"); values.push(address); }
  if (phone_number !== undefined) { updates.push("phone_number = ?"); values.push(phone_number); }

  if (updates.length === 0) return res.status(400).json({ error: "No fields to update." });

  const sql = `UPDATE users SET ${updates.join(", ")} WHERE user_id = ?`;
  values.push(id);

  db.query(sql, values, (error, results) => {
    if (error) {
      console.error("❌ Database error while updating user:", error);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.affectedRows === 0) return res.status(404).json({ error: "User not found." });
    return res.status(200).json({ message: "User updated successfully." });
  });
};

module.exports = updateUser;
