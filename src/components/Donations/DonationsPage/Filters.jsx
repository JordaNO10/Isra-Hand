/**
 * מסננים: חיפוש טקסטואלי ובחירת קטגוריה.
 */
const Filters = ({ searchTerm, setSearchTerm, categories, selectedCategory, setSelectedCategory }) => (
  <div className="filters">
    <input
      type="text"
      placeholder="חפש לפי שם או תיאור..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="donation-search-input"
    />
    <select
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value === "all" ? "all" : parseInt(e.target.value))}
    >
      <option value="all">כל הקטגוריות</option>
      {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
    </select>
  </div>
);
export default Filters;
