import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLogoutMutation } from "../../redux/slices/usersApiSlice";
import { clearCredentials } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";

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
import { RootState } from "../../redux/store";

export default function Nav() {
  const [show, setShow] = useState(false);

  const { userInfo } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logout, { isLoading }] = useLogoutMutation();

  useEffect(() => {
    if (userInfo) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [userInfo]);

  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
      toast.dark("تم تسجيل الخروج بنجاح");
      navigate("/");
    } catch (err) {
      toast.dark("حدث خطأ ما");
      toast.error(err?.data?.message || err.error || JSON.stringify(err));
      console.error(err);
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
            <Link to="/notifications">
              <BellIcon className="Nav__icon" />
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
