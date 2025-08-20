/**
 * קובץ זה אחראי על נתיבי תרומות (Donations Routes):
 * - הגדרת כל נקודות הקצה (Routes) הקשורות לתרומות
 * - אין שינוי לוגי – רק חיבור בין ה־Routes לבקרים (Controllers)
 */

const express = require("express");
const router = express.Router();

const upload = require("../config/multer");

// בקרי תרומות (Donations Controllers)
const addDonation = require("../controllers/donation/addDonation");
const getAllDonations = require("../controllers/donation/getAllDonations");
const getAvailableDonations = require("../controllers/donation/getAvailableDonations");
const updateDonation = require("../controllers/donation/updateDonation");
const deleteDonation = require("../controllers/donation/deleteDonation");

// זרימות בקשה/ביטול/קבלה
const requestDonation = require("../controllers/donation/requestDonation");
const cancelDonationRequest = require("../controllers/donation/cancelDonationRequest");
const markDonationAsAccepted = require("../controllers/donation/markDonationAsAccepted");

// נעילה (Locking)
const getDonationSecure = require("../controllers/donation/getDonationSecure");
const unlockDonation = require("../controllers/donation/unlockDonation");

// תצוגות לפי תפקיד
const getRequestorAcceptedDonations = require("../controllers/donation/getRequestorAcceptedDonations");
const getDonorRequestedDonations = require("../controllers/donation/getDonorRequestedDonations");

/* =========================
 * נתיבים (Routes)
 * =======================*/

// Requestor – תרומות שהתקבלו
router.get("/requestor-accepted/:id", getRequestorAcceptedDonations);

// Public – תרומות זמינות
router.get("/available", getAvailableDonations);

// Donor – תרומות שהתבקשו ע"י מבקשים
router.get("/requested-by-requestors/:id", getDonorRequestedDonations);

// Donor – קבלת בקשה
router.put("/:donationId/accept", markDonationAsAccepted);

// Locking: secure/unlock (לפני "/:id")
router.get("/:id/secure", getDonationSecure);   // נעילת תרומה
router.post("/:id/unlock", unlockDonation);     // שחרור נעילה

// All donations – שליפת כל התרומות
router.get("/", getAllDonations);

// Requestor – בקשה/ביטול תרומה
router.put("/:id/request", requestDonation);
router.put("/:id/cancel", cancelDonationRequest);

// יצירת תרומה עם העלאת תמונה
router.post("/", upload.single("image"), addDonation);

// עדכון תרומה (עם אופציה לתמונה חדשה)
router.put("/:id", upload.single("image"), updateDonation);

// מחיקת תרומה
router.delete("/:id", deleteDonation);

module.exports = router;
