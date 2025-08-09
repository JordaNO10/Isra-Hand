/**
 * גריד "הבקשות שלי" (טרם התקבלו):
 * מציג כרטיסים עם פעולות ביטול/אישור קבלה/פתיחה.
 */

const CardActions = ({ onCancel, onAccept, onOpen, id, donation }) => (
  <div className="card-actions">
    <button onClick={() => onOpen(id)}>פתח</button>
    <button onClick={() => onAccept(donation)} className="primary">קיבלתי</button>
    <button onClick={() => onCancel(id)} className="danger">בטל בקשה</button>
  </div>
);

const RequestsCard = ({ item, onCancel, onAccept, onOpen }) => (
  <div className="request-card">
    {item.donat_photo && <img src={item.donat_photo} alt="" className="thumb" />}
    <h4>{item.donation_name}</h4>
    <p className="desc">{item.description || "—"}</p>
    <p className="meta">תורם: {item.donor_name || "—"}</p>
    <CardActions
      id={item.donation_id}
      donation={item}
      onCancel={onCancel}
      onAccept={onAccept}
      onOpen={onOpen}
    />
  </div>
);

const RequestsGrid = ({ items = [], onCancel, onAccept, onOpen }) => (
  <section>
    {items.length === 0 ? (
      <p className="muted">אין בקשות פעילות.</p>
    ) : (
      <div className="grid">
        {items.map((it) => (
          <RequestsCard
            key={it.donation_id}
            item={it}
            onCancel={onCancel}
            onAccept={onAccept}
            onOpen={onOpen}
          />
        ))}
      </div>
    )}
  </section>
);

export default RequestsGrid;
