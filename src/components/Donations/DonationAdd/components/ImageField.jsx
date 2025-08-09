/**
 * העלאת תמונה לתרומה (תצוגה מקדימה במודאל).
 */
import UploadImage from "../../ImageUpload/UploadImage";

function ImageField({ onImageUpload }) {
  return (
    <>
      <label>תמונת התרומה:</label>
      <UploadImage onUploadImage={onImageUpload} />
    </>
  );
}
export default ImageField;
