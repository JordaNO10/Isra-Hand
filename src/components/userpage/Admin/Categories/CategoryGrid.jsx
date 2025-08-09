/** רשת קטגוריות לבחירה */
const CategoryGrid = ({ categories, selectedId, onSelect }) => (
  <div className="category-grid">
    {categories.map(cat => (
      <div key={cat.group_id}
           className={`category-tile ${selectedId===cat.group_id ? "selected":""}`}
           onClick={() => onSelect(cat.group_id)}>
        <div className="category-name">{cat.category_name}</div>
        <ul className="subcategory-list">
          {cat.subCategories?.map((s, i) => <li key={i}>{s.sub_category}</li>)}
        </ul>
      </div>
    ))}
  </div>
);
export default CategoryGrid;
