import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLogoutMutation } from "../../redux/slices/usersApiSlice";
import { clearCredentials } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import useSignOut from "react-auth-kit/hooks/useSignOut";

// icons
import { UserCircleIcon } from "@heroicons/react/24/outline";
import {
  BellIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
// logo
import logo from "../../assets/images/logo.svg";
// styles
import "../../assets/styles/components/Nav.scss";
import { useGetNotificationsQuery } from "../../redux/slices/notificationsApiSlice";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

export default function Nav() {
  const [show, setShow] = useState(false);

  const userInfo = useAuthUser();
  const isAuthenticated = useIsAuthenticated();

  const { data } = useGetNotificationsQuery(
    {
      captainId: userInfo?.captainId,
      status: "UNREAD",
    },
    { skip: !isAuthenticated },
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logout, { isLoading }] = useLogoutMutation();
  const signOut = useSignOut();

  useEffect(() => {
    if (isAuthenticated) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      signOut();
      toast.dark("تم تسجيل الخروج بنجاح");
      navigate("/");
    } catch (err) {
      toast.dark("حدث خطأ ما");
      toast.error(err?.data?.arabicMessage || err.error || JSON.stringify(err));
      console.error(err?.data?.message);
      navigate("/");
    }
    dispatch(clearCredentials());
  };

  return (
    <nav className="Nav">
      <div className="container">
        <div className="Nav__logo">
          <Link to={show ? "/dashboard" : "/"}>
            <img src={logo} alt="logo" />
            <h2 className="logo-text">كشافتي</h2>
          </Link>
        </div>
        {show && (
          <div className="Nav__icons">
            <Link onClick={handleLogout} to="/">
              <ArrowLeftOnRectangleIcon className="Nav__icon" />
            </Link>
            <Link to="/profile">
              <UserCircleIcon className="Nav__icon" />
            </Link>
            <Link className="bell-icon" to="/notifications">
              <BellIcon className="Nav__icon" />
              <span>{data?.body?.length}</span>
            </Link>
          </div>
        )}
      </div>
      {isLoading && <p>جاري التحميل...</p>}
    </nav>
  );
}

Nav.propTypes = {
  showIcons: PropTypes.bool,
};
