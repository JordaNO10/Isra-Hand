/**
 * כרטיס תרומה עבור רשימת "תרומות אחרונות".
 */
const DonationHomeCard = ({ item, onOpen }) => (
  <div className="donation-card-home">
    <img src={item.donat_photo} alt="Donation" className="item-image-placeholder" />
    <h3>{item.donation_name}</h3>
    <p>תורם: {item.donor_name}</p>
    <p>טלפון: {item.phone}</p>
    <p>אזור: {item.address}</p>
    <div className="donation-card-button-container">
      <button className="donation-card-button" onClick={onOpen}>בקש תרומה</button>
    </div>
  </div>
);
export default DonationHomeCard;
