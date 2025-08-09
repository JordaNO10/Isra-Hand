/**
 * עמוד תרומות:
 * מסננים, כרטיסי תרומות ומודל הצגת Singlepage.
 */
import { useState } from "react";
import "../css/donations.css";
import useAvailableDonations from "../Helpers/useAvailableDonations";
import { useDonationsPage } from "../Helpers/useDonationsPage";
import Filters from "./Filters";
import DonationCard from "./DonationCard";
import SinglepageModal from "./SinglepageModal";

const Donations = () => {
  const { hasMore, loadMore, loading } = useDonationsPage(); // שמור לעתיד
  const {
    filteredDonations,
    categories: availableCategories,
    searchTerm, setSearchTerm,
    selectedCategory, setSelectedCategory,
  } = useAvailableDonations();

  const [visibleCount, setVisibleCount] = useState(3);
  const [showModal, setShowModal] = useState(false);
  const [selectedDonationId, setSelectedDonationId] = useState(null);

  const openModal = (id) => { setSelectedDonationId(id); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setSelectedDonationId(null); };

  return (
    <section className="donations-section">
      <h2 className="section-title">תרומות זמינות לבקשה</h2>

      <Filters
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        categories={availableCategories}
        selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
      />

      <div className="donations-grid">
        {filteredDonations.length === 0 && <p>אין תרומות זמינות כרגע.</p>}
        {filteredDonations.slice(0, visibleCount).map((d) => (
          <DonationCard key={d.donation_id} donation={d} onOpen={openModal} />
        ))}
      </div>

      {visibleCount < filteredDonations.length && (
        <button className="load-more-button" onClick={() => setVisibleCount(v => v + 3)}>טען עוד תרומות</button>
      )}

      <SinglepageModal open={showModal} onClose={closeModal} donationId={selectedDonationId} />
    </section>
  );
};
export default Donations;
