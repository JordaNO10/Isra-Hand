/**
 * לוח תורם (DonorDashboard)
 * - מציג פרטי פרופיל + דירוג ממוצע
 * - "התרומות שלי" + "בקשות שהתקבלו"
 * - העלאת תרומה חדשה
 * - פתיחת המודל Singlepage מכל כרטיס/שורה
 */
import "../css/DonorDashboard.css"
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

// עזרי דאטה/מצבים
import { useDashboardDataHelpers } from "../Helpers/useDashboardDataHelpers";
import { useEditUser } from "../Helpers/userEditUser";
import { useDonorRating } from "../Helpers/useDonorRating";

// קומפוננטות משנה
import DonationAdd from "../../Donations/DonationAdd/DonationAdd";
import ProfileInfoBox from "./ProfileInfoBox";
import MyDonationsGrid from "./MyDonationsGrid";
import RequestedBySection from "./RequestedBySection";
import UserEditModal from "../Modals/UserEditModal";
import Singlepage from "../../Donations/Singlepage/singlePage";

// ===== קומפוננטות קטנות =====

/** מודל Singlepage כללי לשימוש חוזר */
const SinglepageModal = ({ open, donationId, onClose }) => {
  if (!open || !donationId) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>✖</button>
        <Singlepage donationId={donationId} />
      </div>
    </div>
  );
};

// ===== קומפוננטה ראשית =====

const DonorDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  const { userData, setUserData, formatLastLogin, donations, loading, error } =
    useDashboardDataHelpers();
  const { editedUser, handleFieldChange } = useEditUser(userData, setUserData);
  const { rating, loading: ratingLoading, error: ratingError } = useDonorRating();

  // מצב מודלים
  const [showAddDonation, setShowAddDonation] = useState(false);
  const [editingUserModal, setEditingUserModal] = useState(false);

  // בקשות שהתקבלו לתרומות שלי
  const [requested, setRequested] = useState([]);

  // מודל Singlepage
  const [showSinglepage, setShowSinglepage] = useState(false);
  const [selectedDonationId, setSelectedDonationId] = useState(null);
  const openSinglepage = (id) => { setSelectedDonationId(id); setShowSinglepage(true); };
  const closeSinglepage = () => { setShowSinglepage(false); setSelectedDonationId(null); };

  /** טריגר מהניווט (state) – פתיחת חלון "הוספת תרומה" */
  useEffect(() => {
    if (location.state?.setShowModal) {
      setShowAddDonation(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  /** תמיכה לאחור: פתיחה ע"י פרמטר focus (?focus=ID) */
  useEffect(() => {
    const focusId = params.get("focus");
    if (focusId) {
      navigate("/dashboard", { replace: true });
      openSinglepage(Number(focusId));
    }
  }, [params, navigate]);

  /** שליפת בקשות למשתמש הנוכחי (תורם) */
  useEffect(() => {
    if (!userData?.user_id) return;
    axios
      .get(`/donations/requested-by-requestors/${userData.user_id}`)
      .then((res) => setRequested(res.data))
      .catch((err) => console.error("❌ Failed to fetch requested donations", err));
  }, [userData]);

  /** שמירת פרטי משתמש שעודכנו */
  const saveUserChanges = async () => {
    try {
      const fields = Object.keys(editedUser || {});
      for (const f of fields) {
        await axios.put(`/users/${userData.user_id}`, { [f]: editedUser[f] });
        setUserData((prev) => ({ ...prev, [f]: editedUser[f] }));
      }
      setEditingUserModal(false);
    } catch (err) {
      alert("שגיאה בשמירה: " + (err.response?.data?.error || err.message));
    }
  };

  if (loading) return <div className="dashboard">טוען נתונים...</div>;
  if (error)   return <div className="dashboard error">{error}</div>;
  if (!userData) return <div className="dashboard error">משתמש לא נמצא</div>;

  const myDonations = donations.filter((d) => d.user_id === userData.user_id);

  return (
    <div className="dashboard-container">
      <h1 className="welcome-message">ברוך הבא, {userData.full_name} 👋</h1>

      <div className="dashboard-body">
        {/* פרופיל + דירוג */}
        <div className="dashboard-sidebar">
          <ProfileInfoBox
            user={userData}
            lastLogin={formatLastLogin(userData?.last_login)}
            ratingState={{ rating, ratingLoading, ratingError }}
            onEdit={() => setEditingUserModal(true)}
          />
        </div>

        {/* התרומות שלי */}
        <MyDonationsGrid
          items={myDonations}
          onAdd={() => setShowAddDonation(true)}
          onOpen={(id) => openSinglepage(id)}
        />

        {/* בקשות שהתקבלו */}
        <RequestedBySection items={requested} onOpen={(id) => openSinglepage(id)} />
      </div>

      {/* מודל הוספת תרומה */}
      {showAddDonation && (
        <DonationAdd onClose={() => setShowAddDonation(false)} userData={userData} />
      )}

      {/* מודל עריכת משתמש */}
      {editingUserModal && (
        <UserEditModal
          user={userData}
          formValues={{ ...userData, ...editedUser }}
          onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
          onSave={saveUserChanges}
          onCancel={() => setEditingUserModal(false)}
        />
      )}

      {/* מודל Singlepage אחיד */}
      <SinglepageModal
        open={showSinglepage}
        donationId={selectedDonationId}
        onClose={closeSinglepage}
      />
    </div>
  );
};

export default DonorDashboard;
