/**
 * טופס איפוס סיסמה אינליין (בתוך מסך ההתחברות)
 * הערות בעברית + מניעת כפילות Toast:
 * - קורא ל-handleForgotPassword עם { silent: true }
 * - מציג Toast אחד בלבד ברכיב
 */
import React, { useState } from "react";
import { useAuthHelpers } from "../Helpers/useAuthHelpers";
import { toast } from "react-toastify";

const ResetInline = () => {
  const { handleForgotPassword } = useAuthHelpers();
  const [email, setEmail] = useState("");

  // שליחת בקשת איפוס
  const onReset = async (e) => {
    e?.preventDefault?.(); 

    // ולידציה בסיסית בצד לקוח
    if (!email.trim()) {
      toast.error("יש להזין אימייל");
      return;
    }

    const { success, message } = await handleForgotPassword(email, { silent: true });

    toast[success ? "success" : "error"](message, { autoClose: success ? 2500 : 3500 });

    if (success) setEmail("");
  };

  return (
    <div className="reset-form">
      <input
        type="email"
        placeholder="הזן אימייל לאיפוס"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onReset(e)}
      />

      <button type="button" className="signin-btn" onClick={onReset}>
        שלח קישור איפוס
      </button>
    </div>
  );
};

export default ResetInline;
