const db = require("../../utils/db");
const { sendMail } = require("../../utils/mailer");
const {
  requestConfirmation,
  notifyDonor,
} = require("../../templates/emailTemplates");

const requestDonation = async (req, res) => {
  const donationId = req.params.id;

  // מעדיפים מזהי משתמש/תפקיד מהסשן; נופלים לגוף הבקשה לשמירת תאימות
  const s = req.session || {};
  const sessionUser = s.user || {};
  const sessionUserId = s.userId || sessionUser.user_id || null;
  // את אימות התפקיד נעשה מול הדאטהבייס, לא נסמוך על ערכים מהלקוח
  const requestor_id = sessionUserId || req.body.requestor_id || null;

  try {
    // ✅ חייבים להיות מחוברים
    if (!requestor_id) {
      return res.status(401).json({ error: "נדרש להתחבר למערכת" });
    }

    // ✅ אימות תפקיד מול בסיס הנתונים (מבקש = 3)
    const [[roleRow]] = await db
      .promise()
      .query("SELECT role_id FROM users WHERE user_id = ?", [requestor_id]);

    if (!roleRow) {
      return res.status(404).json({ error: "המשתמש לא נמצא" });
    }

    const roleId = Number(roleRow.role_id);
    if (roleId !== 3) {
      return res
        .status(403)
        .json({ error: "רק מבקשי תרומה יכולים לבקש תרומות." });
    }

    // ✅ שליפת התרומה כדי למנוע בקשה עצמית ולהשתמש בפרטים למיילים
    const [[donationRow]] = await db
      .promise()
      .query(
        `SELECT donation_name, user_id AS donor_id FROM donations WHERE donation_id = ?`,
        [donationId]
      );

    if (!donationRow) {
      return res.status(404).json({ error: "התרומה לא נמצאה" });
    }

    if (Number(donationRow.donor_id) === Number(requestor_id)) {
      return res
        .status(400)
        .json({ error: "בעל התרומה לא יכול לבקש את התרומה שלו" });
    }

    // ✅ תפיסה אטומית: מקצים requestor_id רק אם הוא עדיין NULL
    const [updateResult] = await db
      .promise()
      .query(
        `UPDATE donations
         SET requestor_id = ?
         WHERE donation_id = ?
           AND requestor_id IS NULL`,
        [requestor_id, donationId]
      );

    if (updateResult.affectedRows === 0) {
      // מישהו כבר תפס / לחיצה חוזרת
      return res.status(409).json({ error: "התרומה כבר נתבקשה." });
    }

    // ✅ פרטי המבקש (למייל אישור)
    const [[requestor]] = await db
      .promise()
      .query("SELECT email, full_name FROM users WHERE user_id = ?", [
        requestor_id,
      ]);

    if (!requestor) {
      return res.status(404).json({ error: "לא נמצאו פרטי המבקש" });
    }

    // ✅ מייל למבקש
    const confirmationMsg = requestConfirmation(
      requestor.full_name,
      donationRow.donation_name
    );
    await sendMail({
      to: requestor.email,
      subject: "בקשת תרומה התקבלה - Isra-Hand",
      html: confirmationMsg,
    });
    console.log("📧 נשלח מייל למבקש:", requestor.email);

    // ✅ פרטי התורם והודעה לתורם
    const [[donor]] = await db
      .promise()
      .query("SELECT email, full_name FROM users WHERE user_id = ?", [
        donationRow.donor_id,
      ]);

    if (donor) {
      const donorMsg = notifyDonor(
        donor.full_name,
        donationRow.donation_name,
        requestor.full_name,
        donationId
      );
      await sendMail({
        to: donor.email,
        subject: "התרומה שלך התבקשה - Isra-Hand",
        html: donorMsg,
      });
      console.log("📧 נשלח מייל לתורם:", donor.email);
    } else {
      console.warn("⚠️ אזהרה: לא נמצא תורם עבור תרומה:", donationId);
    }

    res.json({ message: "הבקשה נשלחה ונשלחו התראות מתאימות" });
  } catch (err) {
    console.error("❌ שגיאה בעיבוד בקשת תרומה:", err.message);
    res.status(500).json({ error: "שגיאה פנימית בשרת" });
  }
};

module.exports = requestDonation;
