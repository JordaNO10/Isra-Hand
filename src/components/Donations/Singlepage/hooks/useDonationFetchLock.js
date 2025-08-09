/**
 * useDonationFetchLock
 * אחריות: טעינת תרומה בודדת + נעילה/שחרור נעילה בזמן צפייה.
 * מחזיר: donationData, setDonationData, loading, error, accessDenied, releaseLock
 */
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { getDonationById } from "../../Helpers/donationService";
import { isDonationOwner } from "../../Helpers/donationAccessControl";
import { apiUrl } from "./apiBase";

axios.defaults.withCredentials = true;

/** קריאה "מאובטחת" שיוצרת נעילה בצד השרת */
const fetchSecure = async (id) => {
  const res = await axios.get(apiUrl(`/donations/${id}/secure`));
  return res.data;
};

/** קריאה רגילה (ללא נעילה) */
const fetchPlain = async (id) => getDonationById(id);

/** בדיקת הרשאות גישה לתרומה */
const isAllowed = (row, flags) =>
  flags.isAdminUser ||
  isDonationOwner(row?.user_id) ||
  flags.isReqUser ||
  flags.isGuest ||
  flags.isDonorUser;

/** בניית פונקציית שחרור נעילה (עם sendBeacon כשאפשר) */
const buildUnlock = (id, hasLockRef) => async () => {
  if (!hasLockRef.current) return;
  const url = apiUrl(`/donations/${id}/unlock`);
  const payload = JSON.stringify({});
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      if (navigator.sendBeacon(url, blob)) { hasLockRef.current = false; return; }
    }
  } catch {}
  try { await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, credentials: "include", keepalive: true }); }
  finally { hasLockRef.current = false; }
};

export const useDonationFetchLock = (id, flags) => {
  const [donationData, setDonationData] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [accessDenied, setDenied]   = useState(false);
  const hasSecureLockRef            = useRef(false);

  useEffect(() => {
    let alive = true;
    const unlock = buildUnlock(id, hasSecureLockRef);

    const load = async () => {
      try {
        const row = (!flags.isAdminUser && !flags.isGuest)
          ? (hasSecureLockRef.current = true, await fetchSecure(id))
          : await fetchPlain(id);

        if (!alive) return;
        if (!isAllowed(row, flags)) { setDenied(true); return; }
        setDonationData(row);
      } catch (e) {
        const s = e?.response?.status;
        if (s === 401 || s === 403 || s === 423) setDenied(true);
        else setError("טעינת התרומה נכשלה");
      } finally {
        alive && setLoading(false);
      }
    };

    load();

    // שחרור נעילה באירועי יציאה/הסתרה
    const onBeforeUnload = () => unlock();
    const onPageHide     = () => unlock();
    const onVisibility   = () => document.visibilityState === "hidden" && unlock();

    window.addEventListener("beforeunload", onBeforeUnload);
    window.addEventListener("pagehide", onPageHide);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      alive = false;
      unlock();
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.removeEventListener("pagehide", onPageHide);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [id, flags.isAdminUser, flags.isGuest, flags.isReqUser, flags.isDonorUser]);

  const releaseLock = buildUnlock(id, hasSecureLockRef);

  return { donationData, setDonationData, loading, error, accessDenied, releaseLock };
};
