const express = require("express");
const router = express.Router();

const upload = require("../config/multer");

// Import User Controllers
const registerUser = require("../controllers/user/registerUser");
const loginUser = require("../controllers/user/loginUser");
const logoutUser = require("../controllers/user/logoutUser");
const getAllUsers = require("../controllers/user/getAllUsers");
const getUserById = require("../controllers/user/getUserById");
const updateUser = require("../controllers/user/updateUser");
const deleteUser = require("../controllers/user/deleteUser");
const verifyUser = require("../controllers/user/verifyUser");
const forgotPassword = require("../controllers/mailer/sendForgotPassword");
const resetPassword = require("../controllers/mailer/resetPassword");
const {
  resendVerification,
} = require("../controllers/user/resendVerification");

// User Routes
router.post("/register", upload.none(), registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/resend-verification", resendVerification);

router.get("/", getAllUsers);
router.get("/verify", verifyUser);
router.get("/:id", getUserById);

router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
