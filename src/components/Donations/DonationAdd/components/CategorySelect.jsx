/**
 * בחירת קטגוריה ראשית מתוך רשימת קטגוריות.
 */
function CategorySelect({ categories, value, onChange }) {
  return (
    <>
      <label htmlFor="category_name">קטגוריה:</label>
      <select name="category_name" value={value} onChange={onChange}>
        <option value="" disabled>בחר קטגוריה</option>
        {categories.map((cat) => (
          <option key={cat.category_name} value={cat.category_name}>{cat.category_name}</option>
        ))}
      </select>
    </>
  );
}
export default CategorySelect;
