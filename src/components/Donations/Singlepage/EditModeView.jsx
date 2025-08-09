/**
 * קומפוננטה למצב עריכה של תרומה.
 * כוללת טופס עריכה, העלאת תמונה, הצגת הודעות שגיאה.
 */
import DonationForm from "../DonationForm/DonationForm";
import { useDonationEditForm } from "../Helpers/useDonationForm";

const EditModeView = ({ editedData, onSave, setEditedData }) => {
  const { errorMessage, handleChange, handleImageUpload, handleSubmit } =
    useDonationEditForm(editedData, onSave, setEditedData);

  return (
    <>
      <DonationForm
        editedData={editedData}
        onSave={handleSubmit}
        onChange={handleChange}
        onImageUpload={handleImageUpload}
      />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </>
  );
};

export default EditModeView;
