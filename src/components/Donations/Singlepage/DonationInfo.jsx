/**
 * קומפוננטה להצגת פרטי תרומה ופרטי קשר.
 * מציגה גם כפתורי עריכה ומחיקה אם למשתמש יש הרשאות מתאימות.
 */
const DonationInfo = ({ d, canEdit, onEdit, onDelete }) => (
  <div className="modal-info">
    <p><strong>שם התרומה:</strong> {d.donation_name}</p>
    <p><strong>תיאור:</strong> {d.description}</p>
    <p><strong>תורם:</strong> {d.donor_name}</p>
    <p><strong>אימייל:</strong> {d.email}</p>
    <p><strong>טלפון:</strong> {d.phone}</p>
    <p><strong>כתובת:</strong> {d.address}</p>

    {canEdit && (
      <div className="singlepage-button">
        <button className="edit-button" onClick={onEdit}>ערוך</button>
        <button className="delete-button" onClick={onDelete}>מחק תרומה</button>
      </div>
    )}
  </div>
);

export default DonationInfo;
