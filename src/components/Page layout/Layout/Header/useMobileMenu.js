/**
 * ניהול מצב תפריט מובייל + כפתור האמבורגר.
 */
import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

const useMobileMenu = () => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(v => !v);
  const close  = () => setOpen(false);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth > 768) close(); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // מחזירים קומפוננטה, לא JSX
  return { open, toggle, close, Icon: GiHamburgerMenu };
};
export default useMobileMenu;
