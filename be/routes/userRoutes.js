const express = require("express");
const router = express.Router();

// Import User Controllers
const registerUser = require("../controllers/user/registerUser");
const loginUser = require("../controllers/user/loginUser");
const logoutUser = require("../controllers/user/logoutUser");
const getAllUsers = require("../controllers/user/getAllUsers");
const getUserById = require("../controllers/user/getUserById");
const updateUser = require("../controllers/user/updateUser");
const deleteUser = require("../controllers/user/deleteUser");

// User Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/", getAllUsers);
router.get("/:id", getUserById);

router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
