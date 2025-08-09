/**
 * טבלת משתמשים + כפתורי עריכה/מחיקה.
 */
const UsersTable = ({ users, formatLastLogin, onEdit, onDelete }) => (
  <table>
    <thead>
      <tr><th>שם משתמש</th><th>אימייל</th><th>סוג</th><th>כניסה אחרונה</th><th>פעולות</th></tr>
    </thead>
    <tbody>
      {users.map(u => (
        <tr key={u.user_id}>
          <td>{u.username}</td>
          <td>{u.email}</td>
          <td>{{1:"Admin",2:"Donor",3:"Requestor"}[u.role_id] || "לא ידוע"}</td>
          <td>{formatLastLogin(u.last_login)}</td>
          <td>
            <button onClick={() => onEdit(u)}>ערוך</button>
            <button onClick={() => onDelete(u.user_id)}>מחק</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
export default UsersTable;
