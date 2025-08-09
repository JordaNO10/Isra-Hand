/**
 * גריד "תרומות שקיבלתי":
 * מאפשר לפתוח תרומה ולדרג אותה.
 */
const Actions = ({ onOpen, onRate, item }) => (
  <div className="card-actions">
    <button onClick={() => onOpen(item.donation_id)}>פתח</button>
    <button onClick={() => onRate(item)} className="primary">דרג</button>
  </div>
);

const AcceptedCard = ({ item, onOpen, onRate }) => (
  <div className="accepted-card">
    {item.donat_photo && <img src={item.donat_photo} alt="" className="thumb" />}
    <h4>{item.donation_name}</h4>
    <p className="desc">{item.description || "—"}</p>
    <p className="meta">תורם: {item.donor_name || "—"}</p>
    <Actions onOpen={onOpen} onRate={onRate} item={item} />
  </div>
);

const AcceptedGrid = ({ items = [], onOpen, onRate }) => (
  <section>
    {items.length === 0 ? (
      <p className="muted">עוד לא קיבלת תרומות.</p>
    ) : (
      <div className="grid">
        {items.map((it) => (
          <AcceptedCard key={it.donation_id} item={it} onOpen={onOpen} onRate={onRate} />
        ))}
      </div>
    )}
  </section>
);

export default AcceptedGrid;
