/**
 * כרטיס תרומה בודד לרשימה (תמונה/תיאור/כפתור בקשה).
 */
const DonationCard = ({ donation, onOpen }) => (
  <div className="donation-card">
    {donation.donat_photo && <img src={donation.donat_photo} alt="תרומה" className="donation-card-img" />}
    <h3 className="donation-title">{donation.donation_name}</h3>
    <p className="donation-description">{donation.description}</p>
    <p><strong>טלפון:</strong> {donation.phone}</p>
    <p><strong>כתובת:</strong> {donation.address}</p>
    <p><strong>תאריך העלאה:</strong> {donation.donation_date ? new Date(donation.donation_date).toLocaleDateString("he-IL") : "לא זמין"}</p>
    <button className="request-button" onClick={() => onOpen(donation.donation_id)}>בקש תרומה</button>
  </div>
);
export default DonationCard;
