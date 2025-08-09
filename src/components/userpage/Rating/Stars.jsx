/**
 * קומפוננטת כוכבים פשוטה לבחירת דירוג (1–5).
 */
import Star from "./Star";

const Stars = ({ value, onChange }) => (
  <div className="stars">
    {[1,2,3,4,5].map(v => (
      <Star key={v} filled={value>=v} onClick={() => onChange(v)} />
    ))}
  </div>
);
export default Stars;
