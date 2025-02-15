import React, { useState, useEffect } from "react";
import "./css/singlepage.css";
import { useParams, useNavigate } from "react-router-dom";
import DonationForm from "./Donationform";
import DonationImageModal from "./donationimage";
import DonationDropdown from "./DonationDropdown";
import axios from "axios";

function Singlepage() {
  const { id } = useParams(); // Extract the id from the URL
  const navigate = useNavigate();
  const [donationData, setDonationData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonationData = async () => {
      try {
        const response = await axios.get(`/donations/${id}`);
        setDonationData(response.data);
        setEditedData(response.data);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDonationData();
  }, [id]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleEdit = () => setIsEditing(true);

  const handleSave = async (data) => {
    const formData = new FormData();

    // Append all fields to the FormData object
    formData.append("donation_name", data.donation_name);
    formData.append("description", data.description);
    formData.append("email", data.email);

    // Append the image file if it exists
    if (data.image instanceof File) {
      formData.append("image", data.image); // Append the new image file
    }

    try {
      const response = await axios.put(`/donations/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set the correct content type
        },
      });

      // Update the local state with the response data
      setDonationData(response.data);
      setEditedData(response.data);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this donation?")) {
      try {
        await axios.delete(`/donations/${id}`);
        navigate("/Donations");
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      }
    }
  };

  const handleDropdownChange = (selectedId) => {
    if (selectedId) {
      navigate(`/donations/${selectedId}`);
    }
  };

  if (loading) return <div>Loading donation...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!donationData) return <div>Donation not found.</div>;

  return (
    <section className="singlepage-container">
      <div className="singlepage-content">
        {!isEditing && (
          <DonationDropdown
            donations={[]}
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
                    src={`${donationData.donat_photo}`} // Use the full URL
                    alt="Donation"
                    className="singlepage-image-preview"
                    onClick={openModal}
                  />
                </div>
              )}
              <div className="singlepage-buttons">
                <button
                  onClick={() => navigate("/Donations")}
                  className="back-button"
                  aria-label="Go back to donations"
                >
                  חזור אחורה
                </button>
                <button onClick={handleEdit} className="edit-button">
                  ערוך
                </button>
                <button
                  onClick={handleDelete}
                  className="delete-button"
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
