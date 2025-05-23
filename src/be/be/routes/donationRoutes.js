const express = require("express");
const router = express.Router();

// Import Donation Controllers
const donationadd = require("../controllers/donation/addDonation");
const getAllDonations = require("../controllers/donation/getAllDonations");
const getDonationById = require("../controllers/donation/getDonationById");
const updateDonation = require("../controllers/donation/updateDonation");
const deleteDonation = require("../controllers/donation/deleteDonation");
const getAvailableDonations = require("../controllers/donation/getAvailableDonations");
const requestDonation = require("../controllers/donation/requestDonation");
const cancelDonationRequest = require("../controllers/donation/cancelDonationRequest");
const markDonationAsAccepted = require("../controllers/donation/markDonationAsAccepted");

// Import image upload middleware
const upload = require("../config/multer");

// Donation Routes
router.get("/available", getAvailableDonations);
router.get("/:id", getDonationById); // Get one donation
router.put("/:id", upload.single("image"), updateDonation); // Update donation with optional new image
router.delete("/:id", deleteDonation); // Delete donation

router.put("/:donationId/accept", markDonationAsAccepted);
router.put("/:id/request", requestDonation);
router.put("/:id/cancel", cancelDonationRequest);
router.post("/", upload.single("image"), donationadd); // Add donation with image
router.get("/", getAllDonations); // Get all donations
module.exports = router;
