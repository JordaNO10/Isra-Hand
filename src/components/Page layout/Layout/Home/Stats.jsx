/**
 * בלוק סטטיסטיקות בדף הבית.
 */
import { faBox, faHandshake, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Stat = ({ value, icon, label }) => (
  <div className="stat">
    <h3>{value}</h3>
    <FontAwesomeIcon icon={icon} className="stat-icon" />
    <p>{label}</p>
  </div>
);

const Stats = ({ donors, requestors, total }) => (
  <div className="home-stats">
    <Stat value={requestors} icon={faHeart} label="מבקשי תרומות" />
    <Stat value={donors} icon={faHandshake} label="תורמים פעילים" />
    <Stat value={total} icon={faBox} label="מוצרים נתרמו" />
  </div>
);
export default Stats;
