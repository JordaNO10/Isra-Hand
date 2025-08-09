/**
 * תיבת פרטי משתמש (מבקש):
 * מציגה פרטים בסיסיים + כפתור עריכה.
 */

const Row = ({ label, value }) => (
  <div className="profile-row">
    <span className="label">{label}:</span>
    <span className="value">{value || "—"}</span>
  </div>
);

const ProfileInfoBox = ({ user, lastLogin, onEdit }) => (
  <div className="profile-box">
    <h3>{user?.full_name}</h3>
    <Row label="אימייל"  value={user?.email} />
    <Row label="טלפון"  value={user?.phone_number} />
    <Row label="כתובת"  value={user?.address} />
    <Row label="כניסה אחרונה" value={lastLogin} />
    <button className="edit-btn" onClick={onEdit}>עריכת פרטים</button>
  </div>
);

export default ProfileInfoBox;
