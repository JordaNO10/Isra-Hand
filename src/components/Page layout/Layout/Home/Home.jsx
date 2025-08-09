/**
 * דף בית:
 * נתוני פתיחה, סטטיסטיקות, תרומות אחרונות ומודל Singlepage.
 */
import "../../css/Home.css";
import { useState, useEffect } from "react";
import {
  fetchHomepageDonations,
  fetchUserRoleCounts,
  isUserDonor,
  isUserRequestor,
} from "../../Helpers/useHomeHelper";
import Banner from "../../../../assets/Banner.jpeg";
import { useNavigate } from "react-router-dom";
import Singlepage from "../../../Donations/Singlepage/singlePage";
import Stats from "./Stats";
import LatestDonations from "./LatestDonations";
import SinglepageModal from "./SinglepageModal";

const Home = () => {
  const navigate = useNavigate();
  const [latestDonations, setLatestDonations] = useState([]);
  const [donorCount, setDonorCount] = useState(0);
  const [requestorCount, setRequestorCount] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [selectedDonationId, setSelectedDonationId] = useState(null);

  const openSinglepageModal = (id) => { setSelectedDonationId(id); setShowModal(true); };
  const closeSinglepageModal = () => {
    window.dispatchEvent(new Event("singlepage:close")); // שחרור נעילה בסגירה
    setShowModal(false);
    setSelectedDonationId(null);
  };

  useEffect(() => {
    (async () => {
      try {
        const donationData = await fetchHomepageDonations();
        setLatestDonations(donationData.latest);
        setTotalDonations(donationData.total);

        const userData = await fetchUserRoleCounts();
        setDonorCount(userData.donors);
        setRequestorCount(userData.requestors);
      } catch (e) {
        console.error("Error loading homepage data:", e);
      }
    })();
  }, []);

  return (
    <div className="home-page">
      <header className="home-header">
        <h1 className="home-quote">"קַח מָה שֶׁאַתָּה צָרִיךְ, תְּרוֹם מָה שֶׁאַתָּה יָכוֹל."</h1>
      </header>

      <section className="home-banner">
        <div className="banner-placeholder">
          <img src={Banner} alt="Homepage Banner" className="banner-img" />
        </div>
      </section>

      <section className="home-cta">
        <p className="cta-text">הצטרפו למעגל התרומות שלנו - ביחד נחזק את החברה הישראלית!</p>
        <div className="cta-buttons">
          {!isUserRequestor() && (
            <button
              className="cta-button"
              onClick={() => !isUserDonor() ? navigate("/signup") : navigate("/dashboard", { state: { setShowModal: true } })}
            >
              אני רוצה לתרום
            </button>
          )}
          <button className="cta-button secondary" onClick={() => navigate(`/donations`)}>
            אני זקוק לתרומה
          </button>
        </div>
      </section>

      <Stats donors={donorCount} requestors={requestorCount} total={totalDonations} />

      <LatestDonations list={latestDonations} onOpen={openSinglepageModal} />

      <SinglepageModal open={showModal} onClose={closeSinglepageModal}>
        <Singlepage donationId={selectedDonationId} />
      </SinglepageModal>
    </div>
  );
};
export default Home;
