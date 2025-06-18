import { useState } from "react";
import { useRequestorDashboard } from "./Helpers/useRequestorDashboard";
import { useEditUser } from "./Helpers/userEditUser";
import RatingModal from "./RatingModal";
import "./css/RequestorDashboard.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const userId = Cookies.get("userId");

const RequestorDashboard = () => {
  const [isRequesting, setIsRequesting] = useState(false);
  const {
    userData,
    setUserData,
    availableDonations,
    unacceptedRequests,
    acceptedDonations,
    loading,
    error,
    requestDonation,
    cancelRequest,
    markAsAccepted,
  } = useRequestorDashboard();

  const navigate = useNavigate();
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [visibleCount, setVisibleCount] = useState(3);
  const { editMode, editedUser, toggleEditMode, handleFieldChange, saveField } =
    useEditUser(userData, setUserData);

  if (loading) return <div className="dashboard">טוען נתונים...</div>;
  if (error) return <div className="dashboard error">{error}</div>;

  const formatPhoneForDisplay = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) return digits;
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  };

  const handleAccept = async (donation) => {
    await markAsAccepted(donation.donation_id);
    setSelectedDonation(donation);
    setShowRatingModal(true);
  };

  const renderEditableField = (label, fieldKey, type = "text") => (
    <p>
      <strong>{label}:</strong>{" "}
      {editMode[fieldKey] ? (
        <>
          <input
            type={type}
            inputMode={fieldKey === "phone_number" ? "numeric" : "text"}
            placeholder={fieldKey === "phone_number" ? "050-1234567" : ""}
            value={
              fieldKey === "phone_number"
                ? formatPhoneForDisplay(
                    editedUser[fieldKey] ?? userData?.[fieldKey] ?? ""
                  )
                : editedUser[fieldKey] ?? userData?.[fieldKey] ?? ""
            }
            onChange={(e) => {
              let val = e.target.value;
              if (fieldKey === "phone_number") {
                val = val.replace(/\D/g, "");
                if (val.length > 10) return;
              }
              handleFieldChange(fieldKey, val);
            }}
          />
          <button className="save-button" onClick={() => saveField(fieldKey)}>
            ✅
          </button>
        </>
      ) : (
        <>
          {fieldKey === "phone_number"
            ? (userData?.[fieldKey] || "").replace(/(\d{3})(\d{7})/, "$1-$2")
            : userData?.[fieldKey] || "—"}{" "}
          <button
            className="edit-icon-button"
            onClick={() => toggleEditMode(fieldKey, true)}
            title="ערוך"
          >
            ✏️
          </button>
        </>
      )}
    </p>
  );

  const filteredDonations = availableDonations.filter((donation) => {
    const matchesSearch =
      donation.donation_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "" ||
      donation.category_id === Number(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  const visibleDonations = filteredDonations.slice(0, visibleCount);

  return (
    <div className="dashboard-container">
      {isRequesting && (
        <div className="loading-overlay">
          <div className="spinner" />
          <p>שולח בקשה...</p>
        </div>
      )}

      <div className="dashboard-header">
        <div className="profile-info-box">
          <h2>פרטים אישיים:</h2>
          {renderEditableField("שם מלא", "full_name")}
          {renderEditableField("אימייל", "email")}
          {renderEditableField("תאריך לידה", "birth_date", "date")}
          {renderEditableField("טלפון", "phone_number")}
          {renderEditableField("כתובת", "address")}
          <p>
            <strong>סוג משתמש:</strong> מבקש תרומה
          </p>
        </div>
      </div>

      <h1 className="welcome-message">ברוך הבא, {userData?.full_name} 👋</h1>

      <h2 className="section-title">מצא תרומות זמינות:</h2>

      <div className="filter-section">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          <option value="">כל הקטגוריות</option>
          {Array.from(
            new Map(
              availableDonations.map((d) => [d.category_id, d.category_name])
            )
          )
            .sort((a, b) => a[1].localeCompare(b[1], "he")) // Sort by name, Hebrew-aware
            .map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
        </select>
        <input
          type="text"
          placeholder="חפש לפי שם או תיאור..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="items-grid">
        {visibleDonations.length === 0 ? (
          <p>אין תרומות תואמות</p>
        ) : (
          visibleDonations.map((donation) => (
            <div key={donation.donation_id} className="item-card compact">
              {donation.donat_photo && (
                <img
                  src={donation.donat_photo}
                  alt="תמונה"
                  className="item-image-preview"
                  onClick={() => navigate(`/donations/${donation.donation_id}`)}
                />
              )}
              <h3>{donation.donation_name}</h3>
              <p>{donation.category}</p>
              <p>{donation.city}</p>
              <button
                onClick={async () => {
                  setIsRequesting(true);
                  await requestDonation(donation.donation_id);
                  setIsRequesting(false);
                }}
                disabled={isRequesting}
              >
                בקש תרומה זו
              </button>
            </div>
          ))
        )}
      </div>
      {filteredDonations.length > visibleCount && (
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <button
            className="show-more-btn"
            onClick={() => setVisibleCount(visibleCount + 3)}
          >
            הצג עוד תרומות
          </button>
        </div>
      )}

      <h2 className="section-title">הבקשות שלי:</h2>
      <div className="items-grid">
        {unacceptedRequests.map((donation) => (
          <div key={donation.donation_id} className="item-card">
            {donation.donat_photo && (
              <img
                src={donation.donat_photo}
                alt="Donation"
                className="item-image-placeholder"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/donations/${donation.donation_id}`)}
              />
            )}
            <h3>{donation.donation_name}</h3>
            <p>{donation.description}</p>
            <p>{donation.email}</p>
            <div className="request-buttons">
              <button onClick={() => cancelRequest(donation.donation_id)}>
                בטל בקשה
              </button>
              <button onClick={() => handleAccept(donation)}>
                מאשר קבלת תרומה
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="section-title">תרומות שקיבלת:</h2>
      <div className="items-grid">
        {acceptedDonations.map((donation) => (
          <div key={donation.donation_id} className="item-card">
            {donation.donat_photo && (
              <img
                src={donation.donat_photo}
                alt="Donation"
                className="item-image-placeholder"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/donations/${donation.donation_id}`)}
              />
            )}
            <h3>{donation.donation_name}</h3>
            <p>{donation.description}</p>
            <p>{donation.email}</p>

            {donation.rating_user_id == null && (
              <button onClick={() => handleAccept(donation)}>
                דרג את התרומה
              </button>
            )}
          </div>
        ))}
      </div>

      {showRatingModal && selectedDonation && (
        <RatingModal
          donation={selectedDonation}
          donationId={selectedDonation.donation_id}
          requestorId={userId}
          onClose={() => {
            setShowRatingModal(false);
            setSelectedDonation(null);
          }}
        />
      )}
    </div>
  );
};

export default RequestorDashboard;
