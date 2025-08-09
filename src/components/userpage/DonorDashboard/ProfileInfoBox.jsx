/**
 * תיבת פרטי משתמש (תורם):
 * מציגה פרטים בסיסיים + דירוג ממוצע (אם קיים) וכפתור עריכה.
 */
const Row = ({ label, value }) => (
  <div className="profile-row">
    <span className="label">{label}:</span>
    <span className="value">{value || "—"}</span>
  </div>
);

const RatingBadge = ({ rating, loading, error }) => {
  if (loading) return <div className="badge">טוען דירוג...</div>;
  if (error)   return <div className="badge error">דירוג לא זמין</div>;

  const val = Number(rating);
  if (!Number.isFinite(val) || val <= 0) {
    return <div className="badge muted">ללא דירוג</div>;
  }
  return <div className="badge success">⭐ {val.toFixed(1)}</div>;
};

const ProfileInfoBox = ({ user, lastLogin, ratingState, onEdit }) => (
  <div className="profile-box">
    <h3>{user?.full_name}</h3>
    <RatingBadge
  rating={ratingState.rating}
  loading={ratingState.ratingLoading}
  error={ratingState.ratingError}
/>
    <Row label="אימייל"  value={user?.email} />
    <Row label="טלפון"  value={user?.phone_number} />
    <Row label="כתובת"  value={user?.address} />
    <Row label="כניסה אחרונה" value={lastLogin} />
    <button className="edit-btn" onClick={onEdit}>עריכת פרטים</button>
  </div>
);

export default ProfileInfoBox;
