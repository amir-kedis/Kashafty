import useSignOut from "react-auth-kit/hooks/useSignOut";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";

const SignOutButton: React.FC = () => {
  const signOut = useSignOut();
  const navigate = useNavigate();

  return (
    <Button
      className="Button--primary"
      onClick={() => {
        console.log(signOut());
        navigate("/");
      }}
    >
      الرجوع للصفحة الرئيسية
    </Button>
  );
};

export default SignOutButton;
