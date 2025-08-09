/**
 * כוכב בודד (ממולא/ריק).
 */
const Star = ({ filled, onClick }) => (
  <span onClick={onClick} className={filled ? "star selected" : "star"}>★</span>
);
export default Star;
