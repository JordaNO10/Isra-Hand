const express = require("express");
const router = express.Router();

const upload = require("../config/multer");

// Controllers – Donations
const addDonation = require("../controllers/donation/addDonation");
const getAllDonations = require("../controllers/donation/getAllDonations");
const getAvailableDonations = require("../controllers/donation/getAvailableDonations");
const getDonationById = require("../controllers/donation/getDonationById");
const updateDonation = require("../controllers/donation/updateDonation");
const deleteDonation = require("../controllers/donation/deleteDonation");

// Request / Accept flows
const requestDonation = require("../controllers/donation/requestDonation");
const cancelDonationRequest = require("../controllers/donation/cancelDonationRequest");
const markDonationAsAccepted = require("../controllers/donation/markDonationAsAccepted");

// Locking (secure/unlock)
const getDonationSecure = require("../controllers/donation/getDonationSecure");
const unlockDonation = require("../controllers/donation/unlockDonation");

// Views by role
const getRequestorAcceptedDonations = require("../controllers/donation/getRequestorAcceptedDonations");
const getDonorRequestedDonations = require("../controllers/donation/getDonorRequestedDonations");

/* =========================
 * Routes
 * =======================*/

// Requestor-focused
router.get("/requestor-accepted/:id", getRequestorAcceptedDonations);

// Public availability
router.get("/available", getAvailableDonations);

// Donor-focused
router.get("/requested-by-requestors/:id", getDonorRequestedDonations);

// Accept a request (donor action)
router.put("/:donationId/accept", markDonationAsAccepted);

// Locking: secure & unlock (place BEFORE "/:id")
router.get("/:id/secure", getDonationSecure);   // acquires/returns secured view (+ lock)
router.post("/:id/unlock", unlockDonation);      // releases lock

// Single donation by id (place AFTER more-specific routes)
router.get("/:id", getDonationById);

// All donations
router.get("/", getAllDonations);

// Request/cancel donation (requestor actions)
router.put("/:id/request", requestDonation);
router.put("/:id/cancel", cancelDonationRequest);

// Create with image upload
router.post("/", upload.single("image"), addDonation);

// Update with optional new image
router.put("/:id", upload.single("image"), updateDonation);

// Delete
router.delete("/:id", deleteDonation);

module.exports = router;