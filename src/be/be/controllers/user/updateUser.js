const db = require("../../utils/db");

const updateUser = (req, res) => {
  
  const { id } = req.params;
  const {
    username,
    full_name,
    role_id,
    email,
    birth_date,
    address,
    phone_number,
  } = req.body;

  const updates = [];
  const values = [];

  if (username !== undefined) {
    updates.push("username = ?");
    values.push(username);
  }
  if (full_name !== undefined) {
    updates.push("full_name = ?");
    values.push(full_name);
  }
  if (role_id !== undefined) {
    updates.push("role_id = ?");
    values.push(role_id);
  }
  if (email !== undefined) {
    updates.push("email = ?");
    values.push(email);
  }
  if (birth_date !== undefined) {
    updates.push("birth_date = ?");
    values.push(birth_date);
  }
  if (address !== undefined) {
    updates.push("address = ?");
    values.push(address);
  }
  if (phone_number !== undefined) {
    const isValidPhone = /^\d{10}$/.test(phone_number);
    if (!isValidPhone) {
      return res
        .status(400)
        .json({ error: "מספר טלפון חייב להכיל בדיוק 10 ספרות." });
    }
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: "No fields provided for update." });
  }

  const sql = `UPDATE users SET ${updates.join(", ")} WHERE user_id = ?`;
  values.push(id);

  db.query(sql, values, (error, results) => {
    if (error) {
      console.error("Database error while updating user:", error);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ message: "User updated successfully." });
  });
};

module.exports = updateUser;
