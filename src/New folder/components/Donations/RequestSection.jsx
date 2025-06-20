import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function RequestSection({
  isRequestor,
  isLoggedIn,
  hasRequested,
  hasBeenRated,
  hasReceived,
  onRequest,
  onCancel,
  onRate,
  showConfirm,
  setShowConfirm,
}) {
  const navigate = useNavigate();

  if (!isLoggedIn) {
    return (
      <div className="singlepage-button">
        <p>כדי לבקש תרומה, יש להתחבר או להירשם</p>
        <button className="edit-button" onClick={() => navigate("/signin")}>
          התחבר / הרשם
        </button>
      </div>
    );
  }

  if (!isRequestor) return null;

  return (
    <div className="singlepage-button">
      {hasRequested ? (
        <>
          {!hasBeenRated && !hasReceived && (
            <>
              <button
                className="delete-button"
                onClick={() => setShowConfirm(true)}
              >
                ?ביטול בקשת התרומה
              </button>
              {showConfirm && (
                <div className="popup-confirm">
                  <p>האם אתה בטוח שברצונך לבטל?</p>
                  <button onClick={onCancel}>כן</button>
                  <button onClick={() => setShowConfirm(false)}>לא</button>
                </div>
              )}
            </>
          )}

          {!hasBeenRated && hasReceived && (
            <button className="edit-button" onClick={onRate}>
              דרג את התרומה
            </button>
          )}
        </>
      ) : (
        <button className="edit-button" onClick={onRequest}>
          בקש תרומה זו
        </button>
      )}
    </div>
  );
}

export default RequestSection;
