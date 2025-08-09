/**
 * שורת טוגל כללית להגדרות.
 */
const ToggleRow = ({ label, checked, onChange }) => (
  <div className="panel-row">
    <label>
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  </div>
);
export default ToggleRow;
