import React, { useState } from "react";
import "./css/donations.css";
import useAvailableDonations from "./Helpers/useAvailableDonations";
import { useDonationsPage } from "./Helpers/useDonationsPage";
import Singlepage from "./singlePage";

const Donations = () => {
  const { hasMore, loadMore, loading } = useDonationsPage();

  const {
    filteredDonations,
    categories: availableCategories,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
  } = useAvailableDonations();

  const [visibleCount, setVisibleCount] = useState(3);
  const [showModal, setShowModal] = useState(false);
  const [selectedDonationId, setSelectedDonationId] = useState(null);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const openSinglepageModal = (donationId) => {
    setSelectedDonationId(donationId);
    setShowModal(true);
  };

  const closeSinglepageModal = () => {
    setShowModal(false);
    setSelectedDonationId(null);
  };

  return (
    <section className="donations-section">
      <h2 className="section-title">תרומות זמינות לבקשה</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="חפש לפי שם או תיאור..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="donation-search-input"
        />

        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(
              e.target.value === "all" ? "all" : parseInt(e.target.value)
            )
          }
        >
          <option value="all">כל הקטגוריות</option>
          {availableCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="donations-grid">
        {filteredDonations.length === 0 && <p>אין תרומות זמינות כרגע.</p>}
        {filteredDonations.slice(0, visibleCount).map((donation) => (
          <div key={donation.donation_id} className="donation-card">
            {donation.donat_photo && (
              <img
                src={donation.donat_photo}
                alt="תרומה"
                className="donation-card-img"
              />
            )}
            <h3 className="donation-title">{donation.donation_name}</h3>
            <p className="donation-description">{donation.description}</p>
            <p>
              <strong>טלפון:</strong> {donation.phone}
            </p>
            <p>
              <strong>כתובת:</strong> {donation.address}
            </p>
            <p>
              <strong>תאריך העלאה:</strong>{" "}
              {donation.donation_date
                ? new Date(donation.donation_date).toLocaleDateString("he-IL")
                : "לא זמין"}
            </p>
            <button
              className="request-button"
              onClick={() => openSinglepageModal(donation.donation_id)}
            >
              בקש תרומה
            </button>
          </div>
        ))}
      </div>

      {visibleCount < filteredDonations.length && (
        <button className="load-more-button" onClick={handleLoadMore}>
          טען עוד תרומות
        </button>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={closeSinglepageModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeSinglepageModal}>
              ✖
            </button>
            <Singlepage donationId={selectedDonationId} />
          </div>
        </div>
      )}
    </section>
  );
};

export default Donations;
