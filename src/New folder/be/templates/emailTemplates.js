require("dotenv").config();
const donationThankYou = (fullName, donationName) => `
,שלום ${fullName}

! "${donationName}" תודה רבה על תרומתך  
התרומה התקבלה בהצלחה ונשמרה במערכת  

💙 מעריכים את נדיבותך  
Isra-Hand צוות
`;

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
${fullName} שלום,

התקבלה בקשה לאיפוס הסיסמה שלך באתר Isra-Hand.

לאיפוס הסיסמה לחץ על הקישור הבא:
${resetLink}

אם לא ביקשת איפוס – תוכל להתעלם מהודעה זו.

בברכה,  
צוות Isra-Hand
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
  <a href="${process.env.FRONTEND_BASE_URL}/donations/${donationId}">here</a> לחץ כאן על-מנת לגשת לתרומתך
 </p>
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
};
