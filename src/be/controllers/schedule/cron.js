/**
 * Cron Job: שליחת מייל למשתמשים לא פעילים
 * תהליך: רץ פעם ביום (08:00), מאתר משתמשים שלא התחברו מעל 4 ימים,
 * ושולח להם מייל תזכורת אישי.
 */

const cron = require("node-cron");
const db = require("../../utils/dbPromise");
const { exec } = require("child_process");
const { sendMail } = require("../../utils/mailer");

// בדיקה שה־cron נטען
console.log("[Cron] Inactive notifier loaded");

// ריצה יומית בשעה 08:00
cron.schedule("00 08 * * *", async () => {
  console.log("[Cron] Running inactive notifier job");

  try {
    // שליפת משתמשים לא פעילים (מעל 4 ימים)
    const [users] = await db.query(`
      SELECT user_id, full_name, email 
      FROM users 
      WHERE DATEDIFF(NOW(), last_login) >= 4 
        AND is_verified = 1
    `);

    console.log(`[Cron] Found ${users.length} inactive users`);

    // שליחת מייל לכל משתמש לא פעיל
    for (const user of users) {
      await sendMail({
        to: user.email,
        subject: "התגעגענו אליך ב־IsraHand!",
        html: `
    <div dir="rtl" style="text-align:right;">
      <p>שלום ${user.full_name},</p>
      <p>שמנו לב שלא נכנסת לאתר כבר מספר ימים.</p>
      <p>מחכים לך באתר IsraHand – יש תרומות חדשות ובקשות שמחכות לעזרתך!</p>
      <p>נשמח לראותך שוב בקרוב 😊</p>
    </div>
        `,
      });
    }

    console.log("[Cron] Emails sent successfully.");
  } catch (error) {
    console.error("[Cron] Error running job:", error);
  }
});
// ריצה יומית בשעה 22:00 (גיבוי SQL)
cron.schedule(
  "0 22 * * *",
  () => {
    console.log("[Cron] Starting SQL backup at 20:38...");

    exec(`"${__dirname}/../../utils/BACKUP SQL.bat"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`[Cron] Backup failed: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`[Cron] Backup stderr: ${stderr}`);
      }
      console.log(`[Cron] Backup completed: ${stdout}`);
    });
  },
  {
    timezone: "Asia/Jerusalem",
  }
);