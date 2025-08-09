/**
 * בחירה בין שימוש באימייל המשתמש לבין הזנת אימייל חדש.
 */
function EmailChoice({ currentEmail, useUserEmail, setUseUserEmail }) {
  return (
    <div className="email-choice">
      <label>
        <input type="radio" name="emailOption" value="current"
               checked={useUserEmail} onChange={() => setUseUserEmail(true)} />
        השתמש באימייל הנוכחי ({currentEmail})
      </label>
      <label>
        <input type="radio" name="emailOption" value="new"
               checked={!useUserEmail} onChange={() => setUseUserEmail(false)} />
        הזן אימייל חדש
      </label>
    </div>
  );
}
export default EmailChoice;
