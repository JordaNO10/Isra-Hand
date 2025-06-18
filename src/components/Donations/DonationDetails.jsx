function DonationDetails({ donation, onImageClick }) {
  return (
    <>
      <h1 className="singlepage-title">שם התרומה : {donation.donation_name} </h1>

      <p className="donation-info">
        אימייל :<br />
        {donation.email}
      </p>

      <p className="donation-info">
        תיאור התרומה :<br />
        {donation.description}
      </p>

      {donation.donat_photo && (
        <div className="singlepage-image">
          <h3>: תמונת התרומה</h3>
          <img
            src={donation.donat_photo}
            alt="Donation"
            className="singlepage-image-preview"
            onClick={onImageClick}
          />
        </div>
      )}
    </>
  );
}

export default DonationDetails;
