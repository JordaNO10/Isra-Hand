/**
 * useModalState
 * אחריות: ניהול מצב פתיחה/סגירה של מודל התמונה.
 */
import { useState } from "react";

export const useModalState = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return {
    isModalOpen,
    openModal:  () => setIsModalOpen(true),
    closeModal: () => setIsModalOpen(false),
  };
};
