/**
 * בקשת תרומה
 * תפקיד: קבלת בקשה לתרומה ע"י חבר (role=2), בדיקה שהמבקש אינו המעלה, עדכון שיוך,
 *         ושליחת התראות (לא חוסם). פונקציות קצרות ותאימות מלאת לוגיקה קיימת.
 */
const db = require("../../utils/db");
const { sendMail } = require("../../utils/mailer");
const { requestConfirmation, notifyDonor } = require("../../templates/emailTemplates");
const { getRoleId, canRequest, getUserId } = require("../helpers/utils");

// --- עזרי DB קצרים ---
const findDonation = (id) =>
  new Promise((resolve, reject) => {
    const sql = `SELECT d.*, u.email AS donor_email, u.full_name AS donor_name
                 FROM donations d LEFT JOIN users u ON u.user_id = d.user_id
                 WHERE d.donation_id = ? LIMIT 1`;
    db.query(sql, [id], (err, rows) => (err ? reject(err) : resolve(rows[0] || null)));
  });

const assignRequestor = (donationId, requestorId) =>
  new Promise((resolve, reject) => {
    const sql = `UPDATE donations SET requestor_id = ?, accepted = 0
                 WHERE donation_id = ? AND requestor_id IS NULL`;
    db.query(sql, [requestorId, donationId], (err, res) => (err ? reject(err) : resolve(res.affectedRows)));
  });

const notifyAsync = async (donation) => {
  try {
    if (donation.email) {
      await sendMail({
        to: donation.email,
        subject: "בקשתך נרשמה",
        html: requestConfirmation(donation.donation_name, donation.donation_name),
      });
    }
  } catch (e) { console.warn("requestor mail failed", e?.message || e); }

  try {
    if (donation.donor_email) {
      await sendMail({
        to: donation.donor_email,
        subject: "התקבלה בקשה לתרומה",
        html: notifyDonor(donation.donor_name || "", donation.donation_name || "", "", donation.donation_id),
      });
    }
  } catch (e) { console.warn("donor notify failed", e?.message || e); }
};

const requestDonation = async (req, res) => {
  const roleId = getRoleId(req);
  if (!canRequest(roleId)) return res.status(403).json({ error: "אין הרשאה לבקש תרומה" });

  const donationId = req.params.id;
  const requestor_id = getUserId(req);
  if (!requestor_id) return res.status(401).json({ error: "יש להתחבר" });

  try {
    const donation = await findDonation(donationId);
    if (!donation) return res.status(404).json({ error: "Donation not found" });

    // ❗ בלם קריטי: המבקש הוא המעלה? אסור לבקש
    if (donation.user_id && String(donation.user_id) === String(requestor_id)) {
      return res.status(403).json({ error: "לא ניתן לבקש תרומה שהעלית בעצמך" });
    }

    if (donation.requestor_id) return res.status(400).json({ error: "Donation already requested" });

    const affected = await assignRequestor(donationId, requestor_id);
    if (affected === 0) return res.status(409).json({ error: "Donation was taken by another requestor" });

    // התראות לא חוסמות
    notifyAsync(donation).catch(() => {});
    return res.json({ message: "הבקשה נשלחה ונשלחו התראות מתאימות" });
  } catch (e) {
    console.error("requestDonation error:", e);
    return res.status(500).json({ error: "Database error (request donation)" });
  }
};

module.exports = requestDonation;
