import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./css/donations.css";
import { useDonationsPage } from "./Helpers/useDonationsPage";

const Donations = () => {
  const {
    donations,
    loading,
    hasMore,
    loadMore,
    filters,
    setFilters,
    formatDateForDisplay,
  } = useDonationsPage();

  const navigate = useNavigate();
  const location = useLocation();
  // Get unique categories and subcategories
  const categories = [...new Set(donations.map((d) => d.category_name))];
  const subCategories = filters.category
    ? [
        ...new Set(
          donations
            .filter((d) => d.category_name === filters.category)
            .map((d) => d.sub_category)
        ),
      ]
    : [];

  return (
    <section className="donations-section">
      <h2 className="section-title">כל התרומות</h2>

      <div className="filters">
        <select
          value={filters.category}
          onChange={(e) =>
            setFilters({ category: e.target.value, subCategory: "" })
          }
        >
          <option value="">כל הקטגוריות</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {filters.category && (
          <select
            value={filters.subCategory}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, subCategory: e.target.value }))
            }
          >
            <option value="">כל תתי הקטגוריות</option>
            {subCategories.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        )}
      </div>

      {loading && <p className="loading-message">טוען תרומות...</p>}

      <div className="donations-grid">
        {donations.length === 0 && !loading && <p>אין תרומות להצגה.</p>}
        {donations.map((donation) => (
          <div
            key={donation.donation_id}
            className="donation-card"
            onClick={() => navigate(`/donations/${donation.donation_id}`)}
          >
            {donation.donat_photo && (
              <img
                src={donation.donat_photo}
                alt="תרומה"
                className="donation-card-img"
              />
            )}
            <h3 className="donation-title">{donation.donation_name}</h3>
            <p>
              <strong>טלפון:</strong> {donation.phone}
            </p>
            <p>
              <strong>כתובת:</strong> {donation.address}
            </p>
            <p>
              <strong>תאריך העלאה : </strong>
              {donation.donation_date
                ? formatDateForDisplay(donation.donation_date)
                : "לא זמין"}{" "}
            </p>
          </div>
        ))}
      </div>

      {hasMore && !loading && (
        <button className="load-more-button" onClick={loadMore}>
          טען עוד תרומות
        </button>
      )}
    </section>
  );
};

export default Donations;
