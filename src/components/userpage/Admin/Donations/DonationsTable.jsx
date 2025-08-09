/**
 * טבלת תרומות + פתיחה במודל/מחיקה.
 */
const DonationsTable = ({ donations, onOpen, onDelete }) => (
  <table>
    <thead><tr><th>שם תרומה</th><th>תיאור</th><th>פעולות</th></tr></thead>
    <tbody>
      {donations.map(d => (
        <tr key={d.donation_id}>
          <td>{d.donation_name}</td>
          <td>{d.description}</td>
          <td>
            <button onClick={() => onOpen(d)}>פתח</button>
            <button onClick={() => onDelete(d.donation_id)}>מחק</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
export default DonationsTable;
