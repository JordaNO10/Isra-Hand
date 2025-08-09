/**
 * בקרי גודל טקסט: הקטנה, איפוס, הגדלה + תצוגת סקייל.
 */
const FontControls = ({ fontScale, onIncrease, onDecrease, onReset }) => (
  <div className="panel-row">
    <label>גודל טקסט:</label>
    <div className="font-buttons">
      <button onClick={onDecrease}>A−</button>
      <button onClick={onReset}>A</button>
      <button onClick={onIncrease}>A+</button>
    </div>
    <span className="font-scale-display">{fontScale.toFixed(1)}x</span>
  </div>
);
export default FontControls;
