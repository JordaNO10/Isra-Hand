/**
 * יצירת תרומה
 * תפקיד: קליטת נתוני טופס (multipart), ולידציה קלה, מיפוי קטגוריה, שמירת תרומה,
 *         ושליחת מייל תודה (לא חוסם). כולל תאימות לשמות שדות ישנים.
 * שינוי: מנרמל user_id ל-NULL אם אינו מספרי כדי למנוע FK 1452.
 */
const db = require("../../utils/db");
const { buildImageUrl } = require("../../utils/helpers") || {};
const { sendMail } = require("../../utils/mailer");
const { donationThankYou } = require("../../templates/emailTemplates");
const { getRoleId, canDonate, getUserId } = require("../helpers/utils");

const safe = (v) => (typeof v === "string" ? v.trim() : v);
const field = (body, a, b) => safe(body?.[a] ?? body?.[b] ?? "");

const numOrNull = (v) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
};

const getImageUrl = (req, filename) => {
  if (!filename) return null;
  try { if (typeof buildImageUrl === "function") return buildImageUrl(req, filename); } catch (_) {}
  const proto = (req.headers["x-forwarded-proto"] || req.protocol || "http");
  const host = req.headers.host || "localhost:5000";
  return `${proto}://${host}/uploads/${filename}`;
};

const findCategoryId = (categoryName, subCategoryName, cb) => {
  const sql = `SELECT category_id FROM categories
               WHERE category_name = ? AND sub_category = ?
               LIMIT 1`;
  db.query(sql, [categoryName || null, subCategoryName || null], (err, rows) =>
    cb(err, rows?.[0]?.category_id ?? null)
  );
};

const insertDonation = (params, cb) => {
  const sql = `INSERT INTO donations
    (category_id, description, donation_name, donat_photo, quantity, user_id, email)
    VALUES (?, ?, ?, ?, 0, ?, ?)`;
  db.query(sql, params, cb);
};

const addDonation = (req, res) => {
  const roleId = getRoleId(req);
  if (!canDonate(roleId)) return res.status(403).json({ error: "אין הרשאה לתרום" });

  const donationname = field(req.body, "donationname", "donation_name");
  const description  = field(req.body, "description");
  const categoryName = field(req.body, "categoryName", "category_name");
  const subCategory  = field(req.body, "subCategoryName", "sub_category_name");
  const email        = field(req.body, "email");
  const full_name    = field(req.body, "full_name");

  // user_id: קודם body, אם לא – session; ובסוף נרמול למספר או NULL
  const user_id_body = field(req.body, "userId");
  const user_id_sess = getUserId(req);
  const user_id_raw  = user_id_body || user_id_sess || null;
  const user_id      = numOrNull(user_id_raw); // **הנקודה הקריטית** — לא נכניס 0/"" בטעות

  if (!donationname) return res.status(400).json({ error: "נדרש שם תרומה" });

  const filename = req.file && req.file.filename;
  const imageUrl = getImageUrl(req, filename);

  findCategoryId(categoryName, subCategory, (catErr, category_id) => {
    if (catErr) {
      console.error("❌ category lookup:", catErr?.message || catErr);
      return res.status(500).json({ error: "Database error (category lookup)" });
    }
    const params = [category_id, description || null, donationname, imageUrl, user_id, email || null];
    insertDonation(params, async (insErr, result) => {
      if (insErr) {
        // החזרת פרטי שגיאה יעזרו באיתור (בפיתוח)
        console.error("❌ insert donation:", insErr?.code, insErr?.sqlMessage || insErr);
        return res.status(500).json({ error: "Database error (insert donation)", code: insErr?.code });
      }

      const donationId = result.insertId;
      (async () => {
        try {
          if (email) {
            await sendMail({
              to: email,
              subject: "תודה על תרומתך",
              html: donationThankYou(full_name || "", donationname, donationId),
            });
          }
        } catch (e) { console.warn("⚠️ email:", e?.message || e); }
      })();

      return res.status(201).json({ message: "Donation added successfully", donationId });
    });
  });
};

module.exports = addDonation;
