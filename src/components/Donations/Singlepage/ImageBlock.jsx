/**
 * קומפוננטה להצגת תמונת התרומה.
 * לוחצים על התמונה כדי לפתוח אותה במודל תצוגה.
 */
const ImageBlock = ({ src, onClick }) => (
  <div className="modal-image-block">
    <img src={src} alt="תרומה" className="modal-image" onClick={onClick} />
  </div>
);

export default ImageBlock;
