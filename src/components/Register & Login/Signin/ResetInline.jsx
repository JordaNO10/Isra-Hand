/**
 * טופס איפוס קצר בתוך טופס ההתחברות (inline)
 */
import React, { useState } from "react";
import { useAuthHelpers } from "../Helpers/useAuthHelpers";
import { toast } from "react-toastify";

const ResetInline = () => {
  const { handleForgotPassword } = useAuthHelpers();
  const [email, setEmail] = useState("");

  const onReset = async () => {
    if (!email) { toast.error("יש להזין אימייל"); return; }
    const { success, message } = await handleForgotPassword(email);
    success ? toast.success("📩 קישור איפוס נשלח למייל שלך") : toast.error(message);
    if (success) setEmail("");
  };

  return (
    <div className="reset-form">
      <input type="email" placeholder="הזן אימייל לאיפוס"
             value={email} onChange={(e)=>setEmail(e.target.value)} />
      <button onClick={onReset} className="signin-btn" type="button">שלח קישור איפוס</button>
    </div>
  );
};

export default ResetInline;
