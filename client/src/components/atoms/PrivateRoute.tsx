import { Navigate } from "react-router-dom";
import { useValidTokenQuery } from "../../redux/slices/usersApiSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { clearCredentials } from "../../redux/slices/authSlice";

interface PrivateRouteProps {
  element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { isSuccess, isError, isFetching, isLoading } = useValidTokenQuery(
    {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    },
  );

  const dispatch = useDispatch();

  if (isSuccess) {
    console.log("Token is valid");
  }
  if (isError) {
    console.log("Token is expired");
    toast.error("يرجلى تسجيل الدخول");
    dispatch(clearCredentials());
  }

  if (isFetching || isLoading) {
    return <h1 style={{ textAlign: "center" }}>جاري التوثيق</h1>;
  }

  return isSuccess && !isError ? element : <Navigate to="/" replace />;
};

export default PrivateRoute;
