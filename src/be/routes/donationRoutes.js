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
const getRequestorAcceptedDonations = require("../controllers/donation/getRequestorAcceptedDonations");
const getDonorRequestedDonations = require("../controllers/donation/getDonorRequestedDonations");

const upload = require("../config/multer");

router.get("/requestor-accepted/:id", getRequestorAcceptedDonations);
router.get("/available", getAvailableDonations);
router.put("/:donationId/accept", markDonationAsAccepted);
router.get("/requested-by-requestors/:id", getDonorRequestedDonations);
router.get("/:id", getDonationById); // Must be after /requestor-accepted
router.get("/", getAllDonations);

router.put("/:id/request", requestDonation);
router.put("/:id/cancel", cancelDonationRequest);

router.post("/", upload.single("image"), donationadd);

router.put("/:id", upload.single("image"), updateDonation);

router.delete("/:id", deleteDonation);

module.exports = router;
