/**
 * קומפוננטת select להצגת תרומות לפי קטגוריות.
 */
const SelectDonation = ({ groupedDonations, value, onChange }) => (
  <select value={value} onChange={onChange} className="donationdropdown-select">
    <option value="" disabled>בחר תרומה</option>
    {Object.entries(groupedDonations).map(([categoryId, data]) => (
      <optgroup key={categoryId} label={data.category_name}>
        {data.subCategories.map((sub, i) => (
          <option key={`${categoryId}-${i}`} value={sub}>{sub}</option>
        ))}
      </optgroup>
    ))}
  </select>
);
export default SelectDonation;
