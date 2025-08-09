/**
 * useDonationImage / useDonationImageModal
 * תפקיד: העלאת תמונה (ולידציה + בחירה) וניהול מודאל תצוגה מקדימה.
 */
import { useState, useEffect } from "react";

const isValidImage = (file) => {
  const valid = ["image/jpeg", "image/png", "image/gif"];
  return !!file && valid.includes(file.type);
};

export const useImageUpload = (onUploadImage) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [error, setError]               = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!isValidImage(file)) { setError("נא להעלות תמונה תקינה (JPEG / PNG / GIF)."); return; }
    setError(""); setSelectedFile(file); onUploadImage?.(file);
  };

  const toggleModal = () => setIsModalOpen((v) => !v);

  return { selectedFile, isModalOpen, error, handleFileChange, toggleModal };
};

export const useDonationImageModal = (isOpen, image, onClose) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError]   = useState(false);

  useEffect(() => {
    const onKeyDown = (ev) => ev.key === "Escape" && onClose();
    if (isOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => { if (image) { setIsLoading(true); setHasError(false); } }, [image]);

  const handleLoad  = () => setIsLoading(false);
  const handleError = () => { setHasError(true); setIsLoading(false); };

  return { isLoading, hasError, handleLoad, handleError };
};
