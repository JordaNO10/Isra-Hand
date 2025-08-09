/**
 * רשימת תרומות אחרונות בדף הבית.
 */
import DonationHomeCard from "./DonationHomeCard";

const LatestDonations = ({ list, onOpen }) => (
  <section className="latest-donations">
    <h2 className="latest-title">תרומות אחרונות</h2>
    <div className="latest-list">
      {list.map((d) => (
        <DonationHomeCard key={d.donation_id} item={d} onOpen={() => onOpen(d.donation_id)} />
      ))}
    </div>
  </section>
);
export default LatestDonations;
