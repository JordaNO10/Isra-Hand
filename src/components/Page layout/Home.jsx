import "./css/Home.css";
import { useState, useEffect } from "react";
import {
  fetchHomepageDonations,
  fetchUserRoleCounts,
} from "./Helpers/useHomeHelper";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [latestDonations, setLatestDonations] = useState([]);
  const [donorCount, setDonorCount] = useState(0);
  const [requestorCount, setRequestorCount] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);

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
          {/* Future image will go here */}
        </div>
      </section>

      <section className="home-cta">
        <p className="cta-text">
          הצטרפו למעגל התרומות שלנו - ביחד נחזק את החברה הישראלית!
        </p>

        <div className="cta-buttons">
          <button className="cta-button">אני רוצה לתרום</button>
          <button className="cta-button secondary">אני זקוק לתרומה</button>
        </div>
      </section>

      <section className="latest-donations">
        <h2 className="latest-title">תרומות אחרונות</h2>
        <div className="latest-list">
          {latestDonations.map((donation) => (
            <div
              key={donation.donation_id}
              className="donation-card-home"
              onClick={() => navigate(`/donations/${donation.donation_id}`)}
              style={{ cursor: "pointer" }}
            >
              <h3>{donation.donation_name}</h3>
              <p>תאריך העלאה : {donation.donation_date}</p>
              <p>{donation.description}</p>
              <p>קטגוריה : {donation.category_name}</p>
              <p>
                <img
                  src={donation.donat_photo}
                  alt="Donation"
                  className="item-image-placeholder"
                />
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="home-stats">
        <div className="stat">
          <h3>{requestorCount}</h3>
          <p>מבקשי תרומות</p>
        </div>
        <div className="stat">
          <h3>{donorCount}</h3>
          <p>תורמים פעילים</p>
        </div>
        <div className="stat">
          <h3>{totalDonations}</h3>
          <p>מוצרים נתרמו</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
