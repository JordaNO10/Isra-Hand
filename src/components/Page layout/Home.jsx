import "./css/Home.css";
import { useState, useEffect } from "react";
import {
  fetchHomepageDonations,
  fetchUserRoleCounts,
  isUserDonor,
  isUserRequestor,
} from "./Helpers/useHomeHelper";
import Banner from "../../assets/Banner.jpeg";
import { useNavigate } from "react-router-dom";
import { faBox, faHandshake, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Singlepage from "../Donations/singlePage";

const Home = () => {
  const navigate = useNavigate();
  const [latestDonations, setLatestDonations] = useState([]);
  const [donorCount, setDonorCount] = useState(0);
  const [requestorCount, setRequestorCount] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [selectedDonationId, setSelectedDonationId] = useState(null);

  const openSinglepageModal = (donationId) => {
    setSelectedDonationId(donationId);
    setShowModal(true);
  };

  const closeSinglepageModal = () => {
    setShowModal(false);
    setSelectedDonationId(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const donationData = await fetchHomepageDonations();
        setLatestDonations(donationData.latest);
        setTotalDonations(donationData.total);

        const userData = await fetchUserRoleCounts();
        setDonorCount(userData.donors);
        setRequestorCount(userData.requestors);
      } catch (error) {
        console.error("Error loading homepage data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home-page">
      <header className="home-header">
        <h1 className="home-quote">
          "קַח מָה שֶׁאַתָּה צָרִיךְ, תְּרוֹם מָה שֶׁאַתָּה יָכוֹל."
        </h1>
      </header>

      <section className="home-banner">
        <div className="banner-placeholder">
          <img src={Banner} alt="Homepage Banner" className="banner-img" />
        </div>
      </section>

      <section className="home-cta">
        <p className="cta-text">
          הצטרפו למעגל התרומות שלנו - ביחד נחזק את החברה הישראלית!
        </p>

        <div className="cta-buttons">
          {!isUserRequestor() && (
            <button
              className="cta-button"
              onClick={() => {
                if (!isUserDonor()) {
                  navigate("/signup");
                } else {
                  navigate("/donorpage", { state: { setShowModal: true } });
                }
              }}
            >
              אני רוצה לתרום
            </button>
          )}

          <button
            className="cta-button secondary"
            onClick={() => navigate(`/donations`)}
          >
            אני זקוק לתרומה
          </button>
        </div>
      </section>

      <div className="home-stats">
        <div className="stat">
          <h3>{requestorCount}</h3>
          <FontAwesomeIcon icon={faHeart} className="stat-icon" />
          <p>מבקשי תרומות</p>
        </div>
        <div className="stat">
          <h3>{donorCount}</h3>
          <FontAwesomeIcon icon={faHandshake} className="stat-icon" />
          <p>תורמים פעילים</p>
        </div>
        <div className="stat">
          <h3>{totalDonations}</h3>
          <FontAwesomeIcon icon={faBox} className="stat-icon" />
          <p>מוצרים נתרמו</p>
        </div>
      </div>

      <section className="latest-donations">
        <h2 className="latest-title">תרומות אחרונות</h2>
        <div className="latest-list">
          {latestDonations.map((donation) => (
            <div key={donation.donation_id} className="donation-card-home">
              <img
                src={donation.donat_photo}
                alt="Donation"
                className="item-image-placeholder"
              />
              <h3>{donation.donation_name}</h3>
              <p>תורם: {donation.donor_name}</p>
              <p>טלפון: {donation.phone}</p>
              <p>אזור: {donation.address}</p>
              <div className="donation-card-button-container">
                <button
                  className="donation-card-button"
                  onClick={() => openSinglepageModal(donation.donation_id)}
                >
                  בקש תרומה
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

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
    </div>
  );
};

export default Home;
