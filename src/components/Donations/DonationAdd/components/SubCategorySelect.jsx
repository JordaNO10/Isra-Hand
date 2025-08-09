/**
 * בחירת תת־קטגוריה בהתאם לקטגוריה הראשית.
 */
function SubCategorySelect({ categories, categoryName, value, onChange }) {
  const subs = (categories.find(c => c.category_name === categoryName)?.subCategories) || [];
  return (
    <>
      <label htmlFor="sub_category_name">קטגוריה משנית:</label>
      <select name="sub_category_name" value={value} onChange={onChange} disabled={!categoryName}>
        <option value="" disabled>בחר קטגוריה משנית</option>
        {subs.map((s, i) => <option key={`${s}-${i}`} value={s}>{s}</option>)}
      </select>
    </>
  );
}
export default SubCategorySelect;
