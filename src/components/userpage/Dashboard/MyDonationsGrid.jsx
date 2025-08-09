/**
 * גריד "התרומות שלי":
 * כפתור הוספה + כרטיסים עם פתיחה למודל Singlepage.
 */
const Card = ({ item, onOpen }) => (
  <div className="donation-card" onClick={() => onOpen(item.donation_id)}>
    {item.donat_photo && <img src={item.donat_photo} alt="" className="thumb" />}
    <h4>{item.donation_name}</h4>
    <p className="desc">{item.description || "—"}</p>
  </div>
);

const EmptyState = ({ onAdd }) => (
  <div className="empty">
    <p>עדיין לא פרסמת תרומות.</p>
    <button onClick={onAdd}>העלה תרומה ראשונה</button>
  </div>
);

const MyDonationsGrid = ({ items = [], onAdd, onOpen }) => (
  <section>
    <div className="section-head">
      <h2>התרומות שלי</h2>
      <button onClick={onAdd}>+ הוספת תרומה</button>
    </div>
    {items.length === 0 ? (
      <EmptyState onAdd={onAdd} />
    ) : (
      <div className="grid">
        {items.map((it) => <Card key={it.donation_id} item={it} onOpen={onOpen} />)}
      </div>
    )}
  </section>
);

export default MyDonationsGrid;
