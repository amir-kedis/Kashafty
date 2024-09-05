import { Outlet, useLocation } from "react-router-dom";

import Nav from "../common/nav";
import Footer from "../common/Footer";
import { useEffect } from "react";

export default function PublicLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <div className="public_layout">
      <Nav />
      <Outlet />
      <Footer />
    </div>
  );
}
