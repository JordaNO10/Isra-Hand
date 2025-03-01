const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const connection = require("./connection.js"); // Adjust the path as necessary

// POST /signup
router.post("/", async (req, res) => {
  const { username, name, email, password, role, birthdate } = req.body;

  console.log("Received signup request:", { username, name, email, role });

  // Validate role by checking against the roles table
  const checkRoleSql = "SELECT role_id FROM roles WHERE role_name = ?";
  connection.query(checkRoleSql, [role], (error, results) => {
    if (error) {
      console.error("Database error while checking role:", error);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: "Invalid role provided." });
    }

    // Get the role_id from the results
    const roleId = results[0].role_id;

    // Check if the user already exists
    const checkUserSql = "SELECT * FROM users WHERE email = ? OR username = ?";
    connection.query(checkUserSql, [email, username], (error, results) => {
      if (error) {
        console.error("Database error while checking user:", error);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length > 0) {
        console.log("User already exists:", results[0]); // Log the existing user details
        return res
          .status(400)
          .json({ error: "Email or username already exists." });
      }

      // Hash password before inserting into the database
      const saltRounds = 12; // Number of salt rounds for bcrypt
      bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
          console.error("Error hashing password:", err);
          return res.status(500).json({ error: "Database error" });
        }

        const sql =
          "INSERT INTO users (username, full_name, email, password, role_id, birth_date) VALUES (?, ?, ?, ?, ?, ?)";
        connection.query(
          sql,
          [username, name, email, hashedPassword, roleId, birthdate], // Use the role_id here
          (error, results) => {
            if (error) {
              console.error("Database error during user insertion:", error);
              return res.status(500).json({ error: "Database error" });
            }
            console.log("User created successfully with ID:", results.insertId);
            res.status(201).json({
              message: "User created successfully",
              userId: results.insertId,
              username: { username },
            });
          }
        );
      });
    });
  });
});

// POST /users - Create a new user (consider merging with signup)
router.post("/users", (req, res) => {
  const { username, full_name, role_id, email, password, birthdate } = req.body;

  if (
    !username ||
    !full_name ||
    !role_id ||
    !email ||
    !password ||
    !birthdate
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Hash password before inserting into the database
  const saltRounds = 12; // Number of salt rounds for bcrypt
  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const sql = `
      INSERT INTO users (username, full_name, role_id, email, password, birth_date)
      VALUES (?, ?, ?, ?, ?, ?)`;

    connection.query(
      sql,
      [username, full_name, role_id, email, hashedPassword, birthdate],
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
  });
});

module.exports = router;
