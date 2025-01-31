import React, { useState } from "react";
import "../css/singlepage.css"; // Only use the singlepage styles now
import { useParams, useNavigate } from "react-router-dom";
import DonationForm from "./Donationform";
import DonationImageModal from "./donationimage";
import DonationDropdown from "./DonationDropdown";

function Singlepage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const storedDonations = JSON.parse(localStorage.getItem("donations")) || [];
  const donationData = storedDonations.find(
    (donation) => donation.id.toString() === id
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(donationData);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleEdit = () => setIsEditing(true);

  const handleSave = (data) => {
    const updatedDonations = storedDonations.map((donation) =>
      donation.id.toString() === id ? data : donation
    );
    localStorage.setItem("donations", JSON.stringify(updatedDonations));
    setIsEditing(false);
    navigate(0);
  };

  const handleDropdownChange = (selectedId) => {
    if (selectedId) {
      navigate(`/donations/${selectedId}`);
    }
  };

  if (!donationData) {
    return <div>Donation not found.</div>;
  }

  return (
    <section className="singlepage-container">
      <div className="singlepage-content">
        {/* Render DonationDropdown only when not editing */}
        {!isEditing && (
          <DonationDropdown
            donations={storedDonations}
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
                Donation Name : {donationData.name}
              </h1>
              <p className="singlepage-content">Email: {donationData.email}</p>
              <p className="singlepage-content">
                Description: {donationData.description}
              </p>
              {donationData.image && (
                <div className="singlepage-image">
                  <h3>Donation Image:</h3>
                  <img
                    src={donationData.image}
                    alt="Donation"
                    className="singlepage-image-preview"
                    onClick={openModal}
                  />
                </div>
              )}
              <div className="singlepage-buttons">
                <button onClick={() => navigate("/Donations")}>Back</button>
                <button onClick={handleEdit}>Edit</button>
              </div>
            </>
          )}
        </div>
        <DonationImageModal
          isOpen={isModalOpen}
          onClose={closeModal}
          image={donationData.image}
        />
      </div>
    </section>
  );
}

export default Singlepage;
