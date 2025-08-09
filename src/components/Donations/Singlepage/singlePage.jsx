/**
 * קומפוננטת Singlepage
 * מציגה פרטי תרומה בודדת, מאפשרת עריכה/מחיקה לתורם או אדמין,
 * מאפשרת בקשת תרומה, ביטול בקשה או דירוג תרומה למבקש.
 * משמשת גם בתוך מודלים בדפים שונים (Donations, AdminPage, DonorPage, Home).
 */

import "../css/singlepage.css";
import Cookies from "js-cookie";
import { useSinglePage } from "../Singlepage/hooks/useSinglePage";
import { isAdmin, isDonor, isDonationOwner } from "../Helpers/donationAccessControl";

// קומפוננטות ותתי־מודולים
import { useModalCloseRelease } from "./useModalCloseRelease";
import { useRequestFlow } from "./useRequestFlow";
import Guard from "./Guard";
import DonationInfo from "./DonationInfo";
import ImageBlock from "./ImageBlock";
import EditModeView from "./EditModeView";
import RequestSection from "../RequestSection/RequestSection";
import DonationImageModal from "../DonationImage/DonationImageModal";

function Singlepage({ donationId }) {
  const sp = useSinglePage(donationId); // נתוני התרומה והפונקציות מההוק הראשי
  useModalCloseRelease(sp.releaseLock);

  // שליפת פרטי משתמש מהעוגיות
  const userRole = Cookies.get("userRole");
  const userId = Cookies.get("userId");
  const isLoggedIn = !!userRole;
  const isChosen = !!sp.donationData?.requestor_id;

  // בדיקת הרשאות עריכה - נשמר בדיוק כמו בקוד המקורי
  const canEdit =
    isAdmin() && isDonor() && isDonationOwner(sp.donationData?.user_id) && !isChosen;

  // מצבים של מבקש
  const isRequestor = userRole === "3";
  const hasRequested = sp.donationData?.requestor_id === Number(userId);
  const hasBeenRated = sp.donationData?.rating_user_id != null;
  const hasReceived = sp.donationData?.accepted === 1;

  // לוגיקת בקשה/ביטול/דירוג
  const req = useRequestFlow(sp.donationData, sp.requestDonation, sp.cancelRequest);

  return (
    <div className="modal-content-inner">
      <Guard
        loading={sp.loading}
        error={sp.error}
        accessDenied={sp.accessDenied}
        donationData={sp.donationData}
      >
        {sp.isEditing ? (
          <EditModeView
            editedData={sp.editedData}
            onSave={sp.handleSave}
            setEditedData={sp.setEditedData}
          />
        ) : (
          <div className="modal-layout">
            <DonationInfo
              d={sp.donationData}
              canEdit={isLoggedIn && canEdit}
              onEdit={sp.handleEdit}
              onDelete={sp.handleDelete}
            />

            <RequestSection
              isLoggedIn={isLoggedIn}
              isRequestor={isRequestor}
              hasRequested={hasRequested}
              hasBeenRated={hasBeenRated}
              hasReceived={hasReceived}
              onRequest={req.handleRequest}
              onCancel={req.handleCancel}
              onRate={req.handleRate}
              showConfirm={req.showConfirm}
              setShowConfirm={req.setShowConfirm}
              loadingRequest={req.loadingRequest}
            />

<ImageBlock
  src={sp.donationData?.donat_photo || ""}
  onClick={sp.openModal}
/>          </div>
        )}

        <DonationImageModal
  isOpen={sp.isModalOpen}
  onClose={sp.closeModal}
  image={sp.donationData?.donat_photo || ""}
/>
      </Guard>
    </div>
  );
}

export default Singlepage;
