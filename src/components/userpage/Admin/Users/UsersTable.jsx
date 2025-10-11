/**
 * טבלת משתמשים + כפתורי עריכה/מחיקה.
 */
import { useMemo } from "react";

// פונקציות עזר פשוטות לחיפוש בעברית ובאנגלית
function normalize(str) {
  return (str ?? "")
    .toString()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0591-\u05C7\u0300-\u036f]/g, ""); // הסרת ניקוד/הטעמה
}

function matchesUser(user, query) {
  if (!query) return true;
  const needle = normalize(query);
  const haystack = [
    user.username,
    user.email,
    user.full_name,
    user.address,
    user.phone_number,
    { 1: "admin", 2: "donor", 3: "requestor" }[user.role_id],
    String(user.user_id),
  ]
    .map(normalize)
    .join(" | ");
  return haystack.includes(needle);
}

const UsersTable = ({
  users,
  formatLastLogin,
  onEdit,
  onDelete,
  query = "",
}) => {
  // סינון רשימת המשתמשים לפי מחרוזת החיפוש
  const filteredUsers = useMemo(
    () => users.filter((u) => matchesUser(u, query)),
    [users, query]
  );

  return (
    <table>
      <thead>
        <tr>
          <th>שם משתמש</th>
          <th>אימייל</th>
          <th>סוג</th>
          <th>כניסה אחרונה</th>
          <th>פעולות</th>
        </tr>
      </thead>
      <tbody>
        {filteredUsers.map((u) => (
          <tr key={u.user_id}>
            <td>{u.username}</td>
            <td>{u.email}</td>
            <td>
              {{ 1: "Admin", 2: "Donor", 3: "Requestor" }[u.role_id] ||
                "לא ידוע"}
            </td>
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
};

export default UsersTable;
