import { useNavigate } from "react-router-dom";

function BackButton({ userRole }) {
  const navigate = useNavigate();

  const handleBack = () => {
    // Go back to the previous page in history
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Fallback in case there's no history (e.g. direct page entry)
      if (userRole === "1") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  };

  return (
    <div className="singlepage-back-button-wrapper">
      <button className="back-button" onClick={handleBack}>
        חזור אחורה
      </button>
    </div>
  );
}

export default BackButton;
