import React, { useState } from "react";
import "../css/style.css";
import { useParams } from "react-router-dom";

function Singlepage() {
  const { id } = useParams(); // Get the ID from the URL

  // Retrieve donation data from localStorage and find the specific donation by ID
  const donationData = JSON.parse(localStorage.getItem("donations"))?.find(
    (donation) => donation.id.toString() === id
  );
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal

  const openModal = () => {
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };
  if (!donationData) {
    return <div>Donation not found.</div>; // If the donation is not found, show a message
  }
  // Show the donation data
  return (
    <section className="post main">
      <div className="container">
        <div className="single-post">
          <h1 className="post-title">{donationData.name}</h1>
          <p className="post-content">Email: {donationData.email}</p>
          <p className="post-content">
            Description: {donationData.description}
          </p>
          {donationData.image && (
            <div className="donation-image">
              <h3>Donation Image:</h3>
              {/* Image thumbnail */}
              <img
                src={donationData.image}
                alt="Donation"
                style={{ maxWidth: "5vw", cursor: "pointer" }}
                onClick={openModal} // Open the modal when the image is clicked
              />
            </div>
          )}

          <p className="post-content">Thank you for your generous donation!</p>
        </div>

        {/* Modal for showing the large image */}
        {isModalOpen && (
          <div className="modal" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <span className="close" onClick={closeModal}>
                &times;
              </span>
              <img
                src={donationData.image}
                alt="Donation"
                style={{ width: "30vw", height: "auto", overflow: "auto" }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Singlepage;
