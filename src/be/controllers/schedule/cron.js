const cron = require("node-cron");
const db = require("../../utils/dbPromise");
const sendMail = require("../../utils/mailer");

// Test the cron is loading
console.log("[Cron] Inactive notifier loaded");

// Schedule: 11:53 AM daily
cron.schedule("00 08 * * *", async () => {
  console.log("[Cron] Running inactive notifier job");

  try {
    const [users] = await db.query(`
      SELECT user_id, full_name, email 
      FROM users 
      WHERE DATEDIFF(NOW(), last_login) >= 4 
        AND is_verified = 1
    `);

    console.log(`[Cron] Found ${users.length} inactive users`);

    for (const user of users) {
      await sendMail({
        to: user.email, // this MUST be a string like "a@b.com"
        subject: "התגעגענו אליך ב־IsraHand!",
        html: `
    <div dir="rtl" style="text-align:right;">
      <p>שלום , </p>
      <p>${user.full_name}/p>
      <p>שמנו לב שלא נכנסת לאתר כבר מספר ימים.</p>
      <p>מחכים לך באתר IsraHand – יש תרומות חדשות, ובקשות שמחכות לעזרתך!</p>
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
