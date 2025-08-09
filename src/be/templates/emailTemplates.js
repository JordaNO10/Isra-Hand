require("dotenv").config();
const donationThankYou = (fullName, donationName, donationId) => {
  const baseUrl = process.env.FRONTEND_BASE_URL || "http://localhost:3000";
  const donationUrl = `${baseUrl}/donations/${donationId}`;

  return `
<p>שלום ${fullName},</p>
<p>! "${donationName}" תודה רבה על תרומתך</p>
<p>התרומה התקבלה בהצלחה ונשמרה במערכת.</p>

<p>
  לצפייה בפרטי התרומה שלך, לחץ על הקישור הבא:<br>
  <a href="${donationUrl}" target="_blank" style="color:#007bff; text-decoration:underline;">
    לצפייה בתרומה שלך
  </a>
</p>

<p>💙 מעריכים את נדיבותך<br>צוות Isra-Hand</p>
`;
};

const requestConfirmation = (fullName, donationName) => `
,שלום ${fullName}

! "${donationName}" בקשתך לתרומה נקלטה בהצלחה  
צוות Isra-Hand יטפל בהמשך התהליך עבורך  

, בהצלחה
Isra-Hand צוות
`;

const registrationThankYou = (fullName) => `
,${fullName} שלום 

! Isra-Hand  תודה שנרשמת לאתר  
אנחנו שמחים לקבל אותך למעגל התרומות שלנו  

,בהצלחה 
Isra-Hand צוות
`;

const approvalNotification = (donationName) => `
,שלום רב

! "${donationName}" התרומה שלך אושרה בהצלחה  
תודה רבה על שיתוף הפעולה  

Isra-Hand צוות
`;

const adminNotification = (fullName, role) => `
,המשתמש הבא נרשם למערכת

${fullName} 
 ${role} : נרשם לאתר עם התפקיד 
אנא אשר את החשבון לפי הצורך

Isra-Hand מערכת
`;
const passwordResetRequest = (fullName, resetLink) => `
  <p>שלום ${fullName},</p>
  <p>התקבלה בקשה לאיפוס הסיסמה שלך באתר Isra-Hand.</p>
  <p>
    <a href="${resetLink}">לחץ כאן לאיפוס הסיסמה</a>
  </p>
  <p>אם לא ביקשת איפוס – תוכל להתעלם מהודעה זו.</p>
  <p>בברכה,<br>צוות Isra-Hand</p>
`;

const passwordResetSuccess = (fullName) => `
${fullName} שלום,

הסיסמה שלך עודכנה בהצלחה.

אם לא אתה ביצעת את השינוי – אנא צור קשר עם צוות Isra-Hand בהקדם.

בברכה,  
צוות Isra-Hand
`;
const notifyDonor = (donorName, donationName, requestorName, donationId) => `
  <p>שלום ${donorName},</p>
  <p>התרומה שלך "<strong>${donationName}</strong>" התבקשה על ידי המשתמש ${requestorName}.</p>
  <p>אנא התחבר למערכת כדי לאשר או לבדוק את מצב התרומה.</p>
  <p>
  <a href="${process.env.FRONTEND_BASE_URL}/dashboard?focus=${donationId}">here</a> לחץ כאן על-מנת לגשת לתרומתך
 </p>
  <p>תודה,<br>צוות Isra-Hand</p>
`;

const registrationVerificationTemplate = (fullName, verifyUrl) => `
  <h3>ברוך הבא ל־IsraHand, ${fullName}!</h3>
  <p>אנא אמת את כתובת האימייל שלך על ידי לחיצה על הכפתור הבא:</p>
  <a href="${verifyUrl}" style="
    display: inline-block;
    padding: 10px 20px;
    background-color: #007bff;
    color: #ffffff;
    text-decoration: none;
    border-radius: 5px;
    margin-top: 10px;" target="_blank">
    אמת את האימייל שלך
  </a>
  <p>אם הכפתור לא עובד, תוכל להעתיק את הקישור הבא ולהדביק אותו בדפדפן:</p>
  <p style="color:gray">${verifyUrl}</p>
  <p>תודה,<br>צוות Isra-Hand</p>
`;

const emailVerificationTemplate = (fullName, verifyUrl) => `
 <p>שלום ${fullName},</p>
<p>אנא לחץ על הכפתור הבא כדי לאמת את כתובת הדוא"ל שלך:</p>
<a href="${verifyUrl}" style="
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: #ffffff;
  text-decoration: none;
  border-radius: 5px;
  margin-top: 10px;"
  target="_blank">
  לחץ כאן לאימות כתובת הדוא"ל
</a>
<p>אם הכפתור לא עובד, תוכל להעתיק ולהדביק את הקישור הבא בדפדפן שלך:</p>
<p style="color:gray">${verifyUrl}</p>
<p>תודה,<br>צוות Isra-Hand</p>
`;

module.exports = {
  notifyDonor,
  donationThankYou,
  requestConfirmation,
  registrationThankYou,
  approvalNotification,
  adminNotification,
  passwordResetRequest,
  passwordResetSuccess,
  emailVerificationTemplate,
  registrationVerificationTemplate,
};
