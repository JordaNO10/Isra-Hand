import React from "react";
import "./css/singlepage.css";
import Cookies from "js-cookie";
import DonationForm from "./Donationform";
import DonationImageModal from "./donationimage";
import DonationDropdown from "./DonationDropdown";
import { useSinglePage } from "./Helpers/useSinglePage";

function Singlepage() {
  const {
    id,
    donationData,
    editedData,
    isModalOpen,
    isEditing,
    loading,
    error,
    openModal,
    closeModal,
    handleEdit,
    handleSave,
    handleDelete,
    setEditedData,
    handleDropdownChange,
  } = useSinglePage();

  if (loading) return <div>Loading donation...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!donationData) return <div>Donation not found.</div>;

  return (
    <section className="singlepage-container">
      <div className="singlepage-content">
        {!isEditing && (
          <DonationDropdown
            donations={[]} // Could later pass donations here if needed
            currentId={id}
            onSelectDonation={handleDropdownChange}
          />
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
              <p className="singlepage-content">
                {donationData.email} : אימייל
              </p>
              <p className="singlepage-content">
                {donationData.description} : תיאור התרומה
              </p>
              {donationData.donat_photo && (
                <div className="singlepage-image">
                  <h3>: תמונת התרומה</h3>
                  <img
                    src={`${donationData.donat_photo}`}
                    alt="Donation"
                    className="singlepage-image-preview"
                    onClick={openModal}
                  />
                </div>
              )}
              <div className="singlepage-button">
                <button
                  onClick={() => {
                    const userRole = Number(Cookies.get("userRole"));
                    if (userRole === 1) {
                      window.location.href = "/admin";
                    } else {
                      window.location.href = "/Donations";
                    }
                  }}
                  className="singlepage-button back-button"
                  aria-label="Go back to donations"
                >
                  חזור אחורה
                </button>
                <button
                  onClick={handleEdit}
                  className="singlepage-button edit-button"
                >
                  ערוך
                </button>
                <button
                  onClick={handleDelete}
                  className="singlepage-button delete-button"
                  aria-label="Delete donation"
                >
                  מחק תרומה
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
