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

function Singlepage({ donationId }) {
  const {
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
  } = useSinglePage(donationId);

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

  const handleRequest = async () => {
    setLoadingRequest(true);
    try {
      await requestDonation(donationData.donation_id);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Error requesting donation:", error);
      setLoadingRequest(false);
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
  //console.log("🟦 donationData:", donationData);

  return (
    <div className="modal-content-inner">
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
        <div className="modal-layout">
          <div className="modal-info">
            <p>
              <strong>שם התרומה:</strong> {donationData.donation_name}
            </p>
            <p>
              <strong>תיאור:</strong> {donationData.description}
            </p>
            <p>
              <strong>תורם:</strong> {donationData.donor_name}
            </p>
            <p>
              <strong>אימייל:</strong> {donationData.email}
            </p>
            <p>
              <strong>טלפון:</strong> {donationData.phone}
            </p>
            <p>
              <strong>כתובת:</strong> {donationData.address}
            </p>
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
          </div>

          <div className="modal-image-block">
            <img
              src={donationData.donat_photo}
              alt="תרומה"
              className="modal-image"
              onClick={openModal}
            />
          </div>
        </div>
      )}

      <DonationImageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        image={donationData.donat_photo}
      />
    </div>
  );
}

export default Singlepage;
