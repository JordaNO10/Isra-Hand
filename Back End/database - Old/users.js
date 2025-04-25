const express = require("express");
const router = express.Router();
const connection = require("./connection.js"); // Adjust the path as necessary

// GET /users - Get all users
router.get("/", (req, res) => {
  const sql = `
    SELECT users.*, roles.role_name 
    FROM users 
    JOIN roles ON users.role_id = roles.role_id`;

  connection.query(sql, (error, results) => {
    if (error) {
      console.error("Database error while fetching users:", error);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(200).json(results); // Return the list of users
  });
});

// GET /users/:id - Get user information by ID
router.get("/:id", (req, res) => {
  const userId = req.params.id;
  const sql = `
    SELECT users.*, roles.role_name 
    FROM users 
    JOIN roles ON users.role_id = roles.role_id
    WHERE users.user_id = ?`;

  connection.query(sql, [userId], (error, results) => {
    if (error) {
      console.error("Database error while fetching user:", error);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(results[0]); // Return the user information
  });
});

// DELETE /users/:id - Delete a user by ID
router.delete("/:id", (req, res) => {
  const userId = req.params.id;

  const sql = "DELETE FROM users WHERE user_id = ?";
  connection.query(sql, [userId], (error, results) => {
    if (error) {
      console.error("Database error while deleting user:", error);
      return res.status(500).json({ error: "Database error" });
    }

    // Check if any row was affected (user was deleted)
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  });
});

// PUT /users/:id - Update user information by ID
router.put("/:id", (req, res) => {
  const userId = req.params.id;
  const { username, full_name, role_id, email, birth_date } = req.body;

  // Create an array to hold the fields to update
  const updates = [];
  const values = [];

  // Only add fields to the updates array if they have a value
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

  // Check if there are no fields to update
  if (updates.length === 0) {
    return res.status(400).json({ error: "No fields to update." });
  }

  // Create the final SQL query with the dynamic updates
  const sql = `
    UPDATE users 
    SET ${updates.join(", ")} 
    WHERE user_id = ?`;

  // Add userId to the values array
  values.push(userId);

  connection.query(sql, values, (error, results) => {
    if (error) {
      console.error("Database error while updating user:", error);
      return res.status(500).json({ error: "Database error" });
    }

    // Check if any row was affected (user was updated)
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ message: "User updated successfully." });
  });
});

// POST /users - Create a new user
router.post("/", async (req, res) => {
  const { username, full_name, role_id, email, password, birth_date } =
    req.body;

  if (
    !username ||
    !full_name ||
    !role_id ||
    !email ||
    !password ||
    !birth_date
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    const sql = `
      INSERT INTO users (username, full_name, role_id, email, password, birth_date)
      VALUES (?, ?, ?, ?, ?, ?)`;

    connection.query(
      sql,
      [username, full_name, role_id, email, hashedPassword, birth_date],
      (error, results) => {
        if (error) {
          console.error("Database error while creating user:", error);
          return res.status(500).json({ error: "Database error" });
        }

        res.status(201).json({
          message: "User created successfully.",
          userId: results.insertId,
        });
      }
    );
  } catch (error) {
    console.error("Error while hashing password:", error);
    return res.status(500).json({ error: "Error while hashing password" });
  }
});

module.exports = router;
