import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import "./css/donations.css";

const Donations = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null); // Initialize userRole state

  // Load donations from the backend on first render
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/donations", {
          headers: {
            Accept: "application/json",
          },
        });
        setDonations(response.data);
      } catch (error) {
        console.error("Failed to fetch donations:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserRole = async () => {
      try {
        const response = await axios.get(`/users`, {
          headers: {
            Accept: "application/json",
          },
        });

        // Assuming response.data is an array; get the role of the first user
        if (response.data.length > 0) {
          setUserRole(response.data[0].role_id); // Set the role_id of the logged-in user
        } else {
          setUserRole(null); // No user logged in
        }
      } catch (error) {
        console.error("Failed to fetch user role:", error);
        setUserRole(null); // Set to null in case of an error
      }
    };

    fetchUserRole();
    fetchData();
  }, []);

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
          {/* Show message for logged-in users without donations */}
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
        <div>
          {/* Show message for non-logged-in users */}
          {userRole === null && <p>Nothing to show</p>}
        </div>
      </div>
    </section>
  );
};

export default Donations;
