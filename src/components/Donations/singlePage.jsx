import "./css/singlepage.css";
import Cookies from "js-cookie";
import { useState } from "react";
import DonationForm from "./Donationform";
import DonationImageModal from "./donationimage";

import DonationDetails from "./DonationDetails";
import RequestSection from "./RequestSection";
import BackButton from "./BackButton";

import { useDonationEditForm } from "./Helpers/useDonationForm";
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
  } = useSinglePage();

  const { errorMessage, handleChange, handleImageUpload, handleSubmit } =
    useDonationEditForm(editedData, handleSave, setEditedData);

  const userRole = Cookies.get("userRole");
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

  console.log("🧾 donationData", donationData);
  console.log("🔎 hasBeenRated", donationData?.rating_user_id != null);
  return (
    <section className="singlepage-container">
      <div className="singlepage-content">
        <div className="singlepage-post">
          {isEditing ? (
            <>
              <DonationForm
                editedData={editedData}
                onSave={handleSubmit}
                onChange={handleChange}
                onImageUpload={handleImageUpload}
              />
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </>
          ) : (
            <>
              <DonationDetails
                donation={donationData}
                onImageClick={openModal}
              />

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

              <RequestSection
                isRequestor={isRequestor}
                hasRequested={hasRequested}
                onRequest={handleRequest}
                hasBeenRated={donationData?.rating_user_id != null}
                onCancel={handleCancel}
                showConfirm={showConfirm}
                setShowConfirm={setShowConfirm}
              />

              <BackButton userRole={userRole} />
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
