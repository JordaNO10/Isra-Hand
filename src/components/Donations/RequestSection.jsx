function RequestSection({
  isRequestor,
  hasRequested,
  hasBeenRated,
  onRequest,
  onCancel,
  showConfirm,
  setShowConfirm,
}) {
  if (!isRequestor) return null;

  return (
    <div className="singlepage-button">
      {hasRequested ? (
        !hasBeenRated && (
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
        )
      ) : (
        <button className="edit-button" onClick={onRequest}>
          בקש תרומה זו
        </button>
      )}
    </div>
  );
}

export default RequestSection;
