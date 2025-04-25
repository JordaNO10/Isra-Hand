const express = require("express");
const router = express.Router();

// Import Donation Controllers
const addDonation = require("../controllers/donation/addDonation");
const getAllDonations = require("../controllers/donation/getAllDonations");
const getDonationById = require("../controllers/donation/getDonationById");
const updateDonation = require("../controllers/donation/updateDonation");
const deleteDonation = require("../controllers/donation/deleteDonation");

// Import image upload middleware
const upload = require("../config/multer");

// Donation Routes
router.post("/", upload.single("image"), addDonation); // Add donation with image
router.get("/", getAllDonations); // Get all donations
router.get("/:id", getDonationById); // Get one donation
router.put("/:id", upload.single("image"), updateDonation); // Update donation with optional new image
router.delete("/:id", deleteDonation); // Delete donation

module.exports = router;
