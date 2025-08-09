/**
 * טופס עריכת תרומה (שם, אימייל, תיאור, תמונה, טלפון).
 */
import UploadImage from "../ImageUpload/UploadImage";
import "../css/donationform.css";

const DonationForm = ({ editedData, onSave, onChange, onImageUpload }) => {
  return (
    <form className="donationform-container" onSubmit={onSave}>
      <h2>עריכת תרומה</h2>

      <label htmlFor="donation_name">שם התרומה:</label>
      <input name="donation_name" value={editedData.donation_name} onChange={onChange} />

      <label htmlFor="email">אימייל:</label>
      <input type="email" name="email" value={editedData.email} onChange={onChange} />

      <label htmlFor="description">תיאור:</label>
      <textarea name="description" value={editedData.description} onChange={onChange}></textarea>

      <label>עדכן תמונה:</label>
      <UploadImage onUploadImage={onImageUpload} />

      <button type="submit" className="donationform-submit">שמור שינויים</button>

      <label htmlFor="phone_number">מספר טלפון:</label>
      <input type="text" name="phone_number" value={editedData.phone_number || ""} onChange={onChange} />
    </form>
  );
};
export default DonationForm;
