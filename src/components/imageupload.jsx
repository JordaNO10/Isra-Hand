import React, { useState } from "react";

const Uploadimage = ({ onUploadImage }) => {
  const [imageData, setImageData] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Get the selected file

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImageData(reader.result); // Save base64 image to state
        onUploadImage(reader.result); // Pass image to parent component
      };

      reader.readAsDataURL(file); // Convert the image to base64
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {imageData && (
        <div>
          <h3>Uploaded Image Preview:</h3>
          <img
            src={imageData}
            alt="Uploaded Preview"
            style={{ maxWidth: "3vw" }}
          />
        </div>
      )}
    </div>
  );
};

export default Uploadimage;
