/**
 * פאנל תתי־קטגוריות: עריכה/מחיקה/הוספה/מחיקת קטגוריה שלמה.
 */
const SubcategoryPanel = ({
  category, formValues, setFormValues, editingIndex, setEditingIndex,
  onSaveSub, onDeleteSub, onAddSub, newSubValue, setNewSubValue, onDeleteCategory,
}) => (
  <div className="subcategory-panel">
    <h3>תתי קטגוריות: {category.category_name}</h3>

    {category.subCategories.map((sub, idx) => {
      const isEditing = editingIndex === idx;
      const val = isEditing ? (formValues.editedSub ?? sub.sub_category) : sub.sub_category;
      return (
        <div key={idx} className="subcategory-row">
          <input value={val}
            disabled={!isEditing}
            onChange={(e)=>setFormValues({ ...formValues, editedSub: e.target.value })}/>
          <button onClick={() => {
            if (isEditing) onSaveSub(sub, formValues.editedSub);
            setEditingIndex(isEditing ? null : idx);
          }}>
            {isEditing ? "שמור" : "ערוך"}
          </button>
          <button className="delete-subcategory" onClick={() => onDeleteSub(sub)}>
            מחיקת תת קטגוריה
          </button>
        </div>
      );
    })}

    <div className="add-subcategory-row">
      <input placeholder="הוסף תת-קטגוריה חדשה..."
             value={newSubValue} onChange={(e)=>setNewSubValue(e.target.value)}/>
      <button onClick={onAddSub}>הוסף תת-קטגוריה</button>
    </div>

    <button className="delete-category" onClick={onDeleteCategory}>
      מחק קטגוריה
    </button>
  </div>
);
export default SubcategoryPanel;
