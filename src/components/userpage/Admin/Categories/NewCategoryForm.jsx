/**
 * טופס הוספת קטגוריה חדשה.
 */
const NewCategoryForm = ({ value, onChange, onAdd }) => (
  <div className="add-category-form">
    <input type="text" placeholder="הוסף קטגוריה חדשה..."
           value={value} onChange={(e)=>onChange(e.target.value)} />
    <button onClick={onAdd}>הוסף</button>
  </div>
);
export default NewCategoryForm;
