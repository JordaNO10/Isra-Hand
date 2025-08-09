import { useState, useEffect } from "react";

/** בדיקת תקינות קובץ תמונה (MIME) */
const isValidImage = (file) => {
  const valid = ["image/jpeg", "image/png", "image/gif"];
  return !!file && valid.includes(file.type);
};

/**
 * הוק להעלאת תמונה: ולידציה + בחירה + תצוגה מקדימה.
 * שומר על פונקציות קצרות באמצעות פונקציית עזר isValidImage.
 */
export const useImageUpload = (onUploadImage) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");

  // טיפול בשינוי קובץ
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!isValidImage(file)) {
      setError("נא להעלות תמונה תקינה (JPEG / PNG / GIF).");
      return;
    }
    setError("");
    setSelectedFile(file);
    onUploadImage?.(file);
  };

  // פתיחה/סגירה של המודאל לתצוגה מקדימה
  const toggleModal = () => setIsModalOpen((v) => !v);

  return { selectedFile, isModalOpen, error, handleFileChange, toggleModal };
};

/**
 * הוק למודל תצוגת תמונה: ניהול טעינה/שגיאה + סגירה עם Escape.
 */
export const useDonationImageModal = (isOpen, image, onClose) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // סגירה עם מקש Escape
  useEffect(() => {
    const onKeyDown = (ev) => ev.key === "Escape" && onClose();
    if (isOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  // אתחול מצב טעינה בכל החלפת תמונה
  useEffect(() => {
    if (image) { setIsLoading(true); setHasError(false); }
  }, [image]);

  const handleLoad = () => setIsLoading(false);
  const handleError = () => { setHasError(true); setIsLoading(false); };

  return { isLoading, hasError, handleLoad, handleError };
};
