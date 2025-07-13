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

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [loadingRequest, setLoadingRequest] = useState(false);

  const { errorMessage, handleChange, handleImageUpload, handleSubmit } =
    useDonationEditForm(editedData, handleSave, setEditedData);

  const userRole = Cookies.get("userRole");
  const userId = Cookies.get("userId");
  const isLoggedIn = !!userRole;
  const isChosen = !!donationData?.requestor_id;
  const canEdit =
    isDonor() && isDonationOwner(donationData?.user_id) && !isChosen;
  const isRequestor = userRole === "3";
  const hasRequested = donationData?.requestor_id === Number(userId);
  const hasBeenRated = donationData?.rating_user_id != null;
  const hasReceived = donationData?.accepted === 1;
  const [showConfirm, setShowConfirm] = useState(false);
  const handleRequest = async () => {
    setLoadingRequest(true); // ✅ Start loading
    try {
      await requestDonation(donationData.donation_id);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Error requesting donation:", error);
      setLoadingRequest(false); // Stop loading on error
    }
  };

  const handleCancel = async () => {
    await cancelRequest(donationData.donation_id);
    setShowConfirm(false);
    window.location.reload();
  };
  const handleRate = () => {
    setSelectedDonation(donationData);
    setShowRatingModal(true);
  };

  if (loading) return <div>Loading donation...</div>;
  if (error) return <div>Error: {error}</div>;
  if (accessDenied)
    return <div>⛔ Access denied or donation is temporarily locked.</div>;
  if (!donationData) return <div>Donation not found.</div>;

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
                isLoggedIn={isLoggedIn}
                isRequestor={isRequestor}
                hasRequested={hasRequested}
                hasBeenRated={hasBeenRated}
                hasReceived={hasReceived}
                onRequest={handleRequest}
                onCancel={handleCancel}
                onRate={handleRate}
                showConfirm={showConfirm}
                setShowConfirm={setShowConfirm}
                loadingRequest={loadingRequest}
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
