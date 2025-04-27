// src/helpers/useDonationImage.js
import { useState, useEffect } from "react";

// Hook for Image Upload (for Uploadimage component)
export const useImageUpload = (onUploadImage) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validImageTypes.includes(file.type)) {
        setError("Please upload a valid image (JPEG, PNG, or GIF).");
        return;
      }

      setError("");
      setSelectedFile(file);
      onUploadImage(file);
    }
  };

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  return {
    selectedFile,
    isModalOpen,
    error,
    handleFileChange,
    toggleModal,
  };
};

// Hook for Modal Image Handling (for DonationImageModal component)
export const useDonationImageModal = (isOpen, image, onClose) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (image) {
      setIsLoading(true);
      setHasError(false);
    }
  }, [image]);

  const handleLoad = () => setIsLoading(false);
  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  return {
    isLoading,
    hasError,
    handleLoad,
    handleError,
  };
};
