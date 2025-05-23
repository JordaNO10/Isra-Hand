import "./css/singlepage.css";
import Cookies from "js-cookie";
import { useState } from "react";
import DonationForm from "./Donationform";
import DonationImageModal from "./donationimage";
import DonationDropdown from "./DonationDropdown";

import { useSinglePage } from "./Helpers/useSinglePage";
import { isDonor, isDonationOwner } from "./Helpers/donationAccessControl";

function Singlepage() {
  const {
    id,
    donationData,
    requestDonation,
    cancelRequest,
    editedData,
    isModalOpen,
    isEditing,
    loading,
    error,
    accessDenied,
    openModal,
    closeModal,
    handleEdit,
    handleSave,
    handleDelete,
    setEditedData,
    handleDropdownChange,
  } = useSinglePage();

  const userRole = Cookies.get("userRole"); // "3" = Requestor
  const userId = Cookies.get("userId");
  const isLoggedIn = !!userRole;
  const canEdit = isDonor() && isDonationOwner(donationData?.user_id);
  const isRequestor = userRole === "3";
  const hasRequested = donationData?.requestor_id === Number(userId);

  const [showConfirm, setShowConfirm] = useState(false);

  const handleRequest = async () => {
    await requestDonation(donationData.donation_id);
    window.location.reload();
  };

  const handleCancel = async () => {
    await cancelRequest(donationData.donation_id);
    setShowConfirm(false);
    window.location.reload();
  };

  if (loading) return <div>Loading donation...</div>;
  if (error) return <div>Error: {error}</div>;
  if (accessDenied)
    return <div>⛔ Access denied or donation is temporarily locked.</div>;
  if (!donationData) return <div>Donation not found.</div>;

  return (
    <section className="singlepage-container">
      <div className="singlepage-content">
        {!isEditing && isLoggedIn && (
          <div className="donationdropdown-container">
            <DonationDropdown
              currentId={id}
              onSelectDonation={handleDropdownChange}
            />
          </div>
        )}

        <div className="singlepage-post">
          {isEditing ? (
            <DonationForm
              editedData={editedData}
              onSave={handleSave}
              onChange={(data) => setEditedData(data)}
              onImageUpload={(image) => setEditedData({ ...editedData, image })}
            />
          ) : (
            <>
              <h1 className="singlepage-title">
                {donationData.donation_name} : שם התרומה
              </h1>

              <p className="donation-info">
                אימייל :<br />
                {donationData.email}
              </p>

              <p className="donation-info">
                תיאור התרומה :<br />
                {donationData.description}
              </p>

              {donationData.donat_photo && (
                <div className="singlepage-image">
                  <h3>: תמונת התרומה</h3>
                  <img
                    src={donationData.donat_photo}
                    alt="Donation"
                    className="singlepage-image-preview"
                    onClick={openModal}
                  />
                </div>
              )}

              {isLoggedIn && canEdit && (
                <div className="singlepage-button">
                  <button className="edit-button" onClick={handleEdit}>
                    ערוך
                  </button>
                  <button className="delete-button" onClick={handleDelete}>
                    מחק תרומה
                  </button>
                </div>
              )}

              {isRequestor && (
                <div className="singlepage-button">
                  {hasRequested ? (
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
                          <button onClick={handleCancel}>כן</button>
                          <button onClick={() => setShowConfirm(false)}>
                            לא
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <button className="edit-button" onClick={handleRequest}>
                      בקש תרומה זו
                    </button>
                  )}
                </div>
              )}

              <div className="singlepage-back-button-wrapper">
                <button
                  className="back-button"
                  onClick={() => {
                    if (userRole === "1") {
                      window.location.href = "/admin";
                    } else {
                      window.location.href = "/";
                    }
                  }}
                >
                  חזור אחורה
                </button>
              </div>
            </>
          )}
        </div>

        <DonationImageModal
          isOpen={isModalOpen}
          onClose={closeModal}
          image={donationData.donat_photo}
        />
      </div>
    </section>
  );
}

export default Singlepage;
