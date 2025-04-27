import React from "react";
import { useNavigate } from "react-router-dom";
import { useDonationsPage } from "./Helpers/useDonationsPage";
import "./css/donations.css";

const Donations = () => {
  const navigate = useNavigate();
  const { donations, loading, userRole } = useDonationsPage();

  if (loading) return <p>Loading donations...</p>;

  return (
    <section className="donation-section">
      <div className="donation-container">
        <h1>תרומות</h1>

        <div className="donation-items">
          {donations.map((item) => (
            <div key={item.donation_id} className="donation-card">
              <h2>שם התרומה: {item.donation_name}</h2>
              <p>{item.email} אימייל:</p>
              <p>{item.description} תיאור התרומה:</p>
              {item.donat_photo && (
                <div className="donation-image">
                  <img src={item.donat_photo} alt="Donation" />
                </div>
              )}
              <button
                className="donation-button"
                onClick={() => navigate(`/donations/${item.donation_id}`)}
              >
                View {item.donation_name}
              </button>
            </div>
          ))}
        </div>

        <div>
          {userRole === 2 && donations.length === 0 && (
            <>
              <p className="no-donations">
                טרם הכנסת תרומה לאתר באפשרותך לייצר תרומה בלחיצה על הכפתור הבא
              </p>
              <button
                onClick={() => navigate("/donationadd")}
                className="donation-add"
              >
                העלאת תרומה
              </button>
            </>
          )}
        </div>
        <div>{userRole === null && <p>Nothing to show</p>}</div>
      </div>
    </section>
  );
};

export default Donations;
