import React, { useState } from "react";

const EditableField = ({ value, onSave, label }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newValue, setNewValue] = useState(value);

  const handleSave = () => {
    onSave(newValue);
    setIsEditing(false);
  };

  return (
    <div className="editable-field">
      <strong>{label}:</strong>{" "}
      {isEditing ? (
        <>
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
          />
          <button onClick={handleSave} className="save-button">
            Save
          </button>
        </>
      ) : (
        <>
          {value}
          <button onClick={() => setIsEditing(true)} className="edit-button">
            Edit
          </button>
        </>
      )}
    </div>
  );
};

export default EditableField;
