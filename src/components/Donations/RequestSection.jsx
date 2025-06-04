function RequestSection({
  isRequestor,
  hasRequested,
  hasBeenRated,
  hasReceived,      // ✅ new
  onRequest,
  onCancel,
  onRate,           // ✅ new
  showConfirm,
  setShowConfirm,
}) {
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
