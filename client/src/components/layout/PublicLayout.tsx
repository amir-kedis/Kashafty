import { Outlet } from "react-router-dom";

import Nav from "../common/nav";
import Footer from "../common/Footer";

export default function PublicLayout() {
  return (
    <div className="public_layout">
      <Nav />
      <Outlet />
      <Footer />
    </div>
  );
}
