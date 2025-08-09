/**
 * העלאת תמונה עם תצוגה מקדימה ומודאל.
 */
import { useImageUpload } from "../Helpers/useDonationImage";
import "../css/imageupload.css";

const UploadImage = ({ onUploadImage }) => {
  const { selectedFile, isModalOpen, error, handleFileChange, toggleModal } =
    useImageUpload(onUploadImage);

  return (
    <div className="uploadimage-container">
      <input type="file" accept="image/*" onChange={handleFileChange} className="uploadimage-input" />
      {error && <p className="uploadimage-error">שגיאה: {error}</p>}

      {selectedFile && (
        <div className="uploadimage-preview" onClick={toggleModal}>
          <p>תצוגה מקדימה של התמונה (לחץ להגדלה):</p>
          <img src={URL.createObjectURL(selectedFile)} alt="preview" className="uploadimage-thumbnail" />
        </div>
      )}

      {isModalOpen && selectedFile && (
        <div className="uploadimage-modal" onClick={toggleModal}>
          <div className="uploadimage-modal-content">
            <img src={URL.createObjectURL(selectedFile)} alt="full preview" className="uploadimage-full" />
          </div>
        </div>
      )}
    </div>
  );
};
export default UploadImage;
