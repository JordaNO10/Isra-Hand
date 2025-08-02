import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useDashboardDataHelpers } from "./Helpers/useDashboardDataHelpers";
import { useEditUser } from "./Helpers/userEditUser";
import { useDonorRating } from "./Helpers/useDonorRating";
import DonationAdd from "../Donations/Donationadd";
import UserEditModal from "./UserEditModal";
import "./css/DonorDashboard.css";

const DonorDashboard = () => {
  const {
    rating,
    loading: ratingLoading,
    error: ratingError,
  } = useDonorRating();

  const { userData, setUserData, formatLastLogin, donations, loading, error } =
    useDashboardDataHelpers();
  const { editedUser, handleFieldChange } = useEditUser(userData, setUserData);

  const [showModal, setShowModal] = useState(false);
  const [editingUserModal, setEditingUserModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [requested, setRequested] = useState([]);

  useEffect(() => {
    if (location.state?.setShowModal) {
      setShowModal(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    if (!userData?.user_id) return;
    axios
      .get(`/donations/requested-by-requestors/${userData.user_id}`)
      .then((res) => setRequested(res.data))
      .catch((err) =>
        console.error("❌ Failed to fetch requested donations", err)
      );
  }, [userData]);

  if (loading) return <div className="dashboard">טוען נתונים...</div>;
  if (error) return <div className="dashboard error">{error}</div>;
  if (!userData) return <div className="dashboard error">משתמש לא נמצא</div>;

  const myDonations = donations.filter(
    (donation) => donation.user_id === userData.user_id
  );

  return (
    <div className="dashboard-container">
      <h1 className="welcome-message">ברוך הבא, {userData.full_name} 👋</h1>

      <div className="dashboard-body">
        <div className="dashboard-main">
          <div className="dashboard-sidebar">
            <div className="profile-info-box">
              <h2>פרטים אישיים:</h2>
              <p>
                <strong>שם מלא:</strong> {userData.full_name}
              </p>
              <p>
                <strong>אימייל:</strong> {userData.email}
              </p>
              <p>
                <strong>תאריך לידה:</strong> {userData.birth_date}
              </p>
              <p>
                <strong>טלפון:</strong> {userData.phone_number}
              </p>
              <p>
                <strong>כתובת:</strong> {userData.address}
              </p>
              <p>
                <strong>סוג משתמש:</strong> תורם
              </p>
              <p>התחברות אחרונה: {formatLastLogin(userData?.last_login)}</p>
              <button onClick={() => setEditingUserModal(true)}>
                ✏️ ערוך פרופיל
              </button>
              {ratingLoading ? (
                <p>טוען דירוג...</p>
              ) : ratingError ? (
                <p style={{ color: "red" }}>שגיאה בטעינת הדירוג</p>
              ) : (
                <p>
                  <strong>דירוג:</strong> ⭐ {rating?.avg_rating ?? "—"} (
                  {rating?.total_ratings} דירוגים)
                </p>
              )}
            </div>
          </div>

          {myDonations.length > 0 && (
            <div className="donations-header">
              <h2 className="section-title">התרומות שלי:</h2>
              <button
                className="upload-donation-btn"
                onClick={() => setShowModal(true)}
              >
                העלאת תרומה
              </button>
            </div>
          )}

          {myDonations.length === 0 ? (
            <div className="no-donations-message">
              <p>עדיין לא העלית תרומות. התחל לעזור לאחרים כבר עכשיו!</p>
              <button
                className="upload-donation-btn"
                onClick={() => setShowModal(true)}
              >
                העלאת תרומה ראשונה
              </button>
            </div>
          ) : (
            <div className="items-grid">
              {myDonations.map((donation) => (
                <div
                  key={donation.donation_id}
                  className="item-card"
                  onClick={() => navigate(`/donations/${donation.donation_id}`)}
                  style={{ cursor: "pointer" }}
                >
                  {donation.donat_photo ? (
                    <img
                      src={donation.donat_photo}
                      alt="Donation"
                      className="item-image-placeholder"
                    />
                  ) : (
                    <div className="item-image-placeholder">אין תמונה</div>
                  )}
                  <h3>{donation.donation_name}</h3>
                  <p>{donation.description}</p>
                  <p>{donation.email}</p>
                </div>
              ))}
            </div>
          )}

          {requested.length > 0 && (
            <div className="requested-donations-section">
              <h2 className="section-title">תרומות שהתבקשו:</h2>
              <div className="items-grid">
                {requested.map((item) => (
                  <div key={item.donation_id} className="item-card">
                    <h3>{item.donation_name}</h3>
                    <p>{item.description}</p>
                    {item.donat_photo ? (
                      <img
                        src={item.donat_photo}
                        alt="Donation"
                        className="item-image-placeholder"
                      />
                    ) : (
                      <div className="item-image-placeholder">אין תמונה</div>
                    )}
                    <div className="requestor-info">
                      <h4>פרטי מבקש:</h4>
                      <p>
                        <strong>שם:</strong> {item.requestor_name}
                      </p>
                      <p>
                        <strong>אימייל:</strong> {item.requestor_email}
                      </p>
                      <p>
                        <strong>טלפון:</strong> {item.requestor_phone}
                      </p>
                      <p>
                        <strong>כתובת:</strong> {item.requestor_address}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <DonationAdd onClose={() => setShowModal(false)} userData={userData} />
      )}

      {editingUserModal && (
        <UserEditModal
          user={userData}
          formValues={{ ...userData, ...editedUser }} // ✅ show live data
          onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
          onSave={async () => {
            try {
              const fields = Object.keys(editedUser);
              for (let field of fields) {
                await axios.put(`/users/${userData.user_id}`, {
                  [field]: editedUser[field],
                });
                setUserData((prev) => ({
                  ...prev,
                  [field]: editedUser[field],
                }));
              }
              setEditingUserModal(false);
            } catch (err) {
              alert(
                "שגיאה בשמירה: " + (err.response?.data?.error || err.message)
              );
            }
          }}
          onCancel={() => setEditingUserModal(false)}
        />
      )}
    </div>
  );
};

export default DonorDashboard;
