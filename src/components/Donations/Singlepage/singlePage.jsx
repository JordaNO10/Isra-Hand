/**
 * קומפוננטת Singlepage
 * תפקיד: הצגת תרומה בודדת + פעולות. שינוי לפי דרישה:
 *  - Member (2) יכול לבקש תרומה.
 *  - המעלה (owner) "רק צופה" — לא יכול לבקש ולא לערוך/למחוק.
 *  - נרמול לוגיקת "מבקש" לפי Helpers/donationAccessControl (2/1) במקום "3" ישן.
 */
import "../css/singlepage.css";
import Cookies from "js-cookie";
import { useSinglePage } from "../Singlepage/hooks/useSinglePage";
import {
  isAdmin,
  isDonor,
  isDonationOwner,
  isRequestor as isRequestorRole, // חדש: משתמשים בפונקציה שמנרמלת 3→2
} from "../Helpers/donationAccessControl";

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

  // סטטוס תרומה
  const isChosen = !!sp.donationData?.requestor_id;

  // בעלות
  const ownerId = sp.donationData?.user_id;
  const isOwner = isDonationOwner(ownerId);

  //  "מבקש" לפי הלוגיקה החדשה: Member(2) או Admin(1), אבל לא הבעלים
const isRequestor = !isAdmin() && isRequestorRole() && !isOwner;

  // המעלה רואה בלבד: אם המשתמש הוא הבעלים ואינו אדמין → cannot edit
  // (שומרים את הנוסחה המקורית ואז מכבים במידת הצורך)
  let canEdit =
    isAdmin() && isDonor() && isDonationOwner(sp.donationData?.user_id) && !isChosen; // נוסחה מקורית
  if (isOwner && !isAdmin()) canEdit = false; // בלם: המעלה שאינו אדמין — צפייה בלבד

  // לוגיקת בקשה/ביטול/דירוג (כוללת בלם נוסף נגד owner בצד הלקוח)
  const req = useRequestFlow(sp.donationData, sp.requestDonation, sp.cancelRequest);

  // מצבים נוספים למקטע הבקשות
  const hasRequested = sp.donationData?.requestor_id === Number(userId);
  const hasBeenRated = sp.donationData?.rating_user_id != null;
  const hasReceived = sp.donationData?.accepted === 1;

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
            />
          </div>
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
