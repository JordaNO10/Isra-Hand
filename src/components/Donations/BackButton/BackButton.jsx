/**
 * כפתור חזרה:
 * אם יש היסטוריה – חוזר אחורה; אחרת מנתב לביתה/אדמין לפי תפקיד.
 */
import { useNavigate } from "react-router-dom";

function BackButton({ userRole }) {
  const navigate = useNavigate();
  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate(userRole === "1" ? "/admin" : "/");
  };
  return (
    <div className="singlepage-back-button-wrapper">
      <button className="back-button" onClick={handleBack}>חזור אחורה</button>
    </div>
  );
}
export default BackButton;
