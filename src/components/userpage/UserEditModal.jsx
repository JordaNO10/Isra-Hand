import React from "react";
import "./css/UserEditModal.css"; // We'll define this shortly

const UserEditModal = ({ user, formValues, onChange, onSave, onCancel }) => {
  if (!user) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>עריכת משתמש</h3>

        <label>שם מלא:</label>
        <input
          name="full_name"
          value={formValues.full_name || ""}
          onChange={onChange}
        />

        <label>אימייל:</label>
        <input
          name="email"
          value={formValues.email || ""}
          onChange={onChange}
        />

        <label>טלפון:</label>
        <input
          name="phone_number"
          value={formValues.phone_number || ""}
          onChange={onChange}
        />

        <label>כתובת:</label>
        <input
          name="address"
          value={formValues.address || ""}
          onChange={onChange}
        />

        <label>סוג משתמש:</label>
        <select name="role_id" value={formValues.role_id} onChange={onChange}>
          <option value={1}>Admin</option>
          <option value={2}>Donor</option>
          <option value={3}>Requestor</option>
        </select>
        <div className="modal-buttons">
          <button onClick={onSave}>שמור</button>
          <button onClick={onCancel}>ביטול</button>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal;
