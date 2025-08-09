/**
 * בקשות שהתקבלו מהמבקשים עבור התרומות שלי:
 * מציג שם תרומה + פרטי מבקש + כפתור לפתיחת מודל Singlepage.
 */
const getPhotoSrc = (p) => {
  if (!p) return null;
  // If it’s already absolute, use as-is
  if (/^https?:\/\//i.test(p)) return p;

  // Build absolute URL for relative paths/filenames
  const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  // Normalize common cases: "uploads/..." or just a filename
  const path = p.startsWith("uploads/") ? p : `uploads/${p}`;
  return `${base}/${path}`;
};

const PhotoCell = ({ src, alt = "" }) => {
  const url = getPhotoSrc(src);
  return url ? <img src={url} alt={alt} className="thumb" /> : "—";
};
const Col = ({ children }) => <td>{children || "—"}</td>;

const Row = ({ row, onOpen }) => (
  <tr>
    <Col>{row.donation_name}</Col>
    <Col>{row.requestor_name || row.full_name}</Col>
    <Col>{row.requestor_phone || row.phone_number || row.phone}</Col>
    <Col>{row.requestor_email || row.email}</Col>
    <Col>
          <PhotoCell src={row.donat_photo} alt={row.donation_name || "תרומה"} />
    </Col>    
    <td><button onClick={() => onOpen?.(row.donation_id)}>פתח</button></td>
  </tr>
);

const RequestedBySection = ({ items = [], onOpen }) => (
  <section className="requested-section">
    <h2>בקשות שהתקבלו</h2>
    {items.length === 0 ? (
      <p className="muted">אין בקשות פעילות כרגע.</p>
    ) : (
      <table className="table">
        <thead>
          <tr><th>תרומה</th><th>מבקש</th><th>טלפון</th><th>אימייל</th><th>צילום התרומה</th><th/></tr>
        </thead>
        <tbody>
          {items.map((r, i) => <Row key={r.donation_id ?? i} row={r} onOpen={onOpen} />)}
        </tbody>
      </table>
    )}
  </section>
);

export default RequestedBySection;
