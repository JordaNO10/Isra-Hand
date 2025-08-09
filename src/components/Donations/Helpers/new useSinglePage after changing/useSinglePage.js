/**
 * useSinglePage (אגרגטור ראשי)
 * מחבר בין כל ההוקים הקטנים ושומר על אותו API כמו קודם.
 */
import Cookies from "js-cookie";
import { isAdmin, isDonor, isRequestor } from "../../Helpers/donationAccessControl";
import { useDonationFetchLock } from "./useDonationFetchLock";
import { useEditActions } from "./useEditActions";
import { useModalState } from "./useModalState";
import { useRequestActions } from "./useRequestActions";

export const useSinglePage = (donationId) => {
  const flags = {
    userRole: Cookies.get("userRole"),
    isAdminUser:  isAdmin(),
    isReqUser:    isRequestor(),
    isDonorUser:  isDonor(),
    isGuest:      !Cookies.get("userRole"),
  };

  const {
    donationData, setDonationData, loading, error, accessDenied, releaseLock,
  } = useDonationFetchLock(donationId, flags);

  const { editedData, setEditedData, isEditing, handleEdit, handleSave, handleDelete } =
    useEditActions(donationId, donationData, setDonationData);

  const { isModalOpen, openModal, closeModal } = useModalState();

  const { requestDonation, cancelRequest } = useRequestActions();

  // שימור API זהה לקוד הקיים:
  return {
    donationData,
    requestDonation,
    cancelRequest,
    editedData,
    isModalOpen,
    isEditing,
    loading,
    error,
    accessDenied,
    openModal,
    closeModal,
    handleEdit,
    handleSave,
    handleDelete,
    setEditedData,
    releaseLock,
  };
};
