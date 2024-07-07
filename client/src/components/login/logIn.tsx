import { useState, useEffect, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../common/Button";
import TextInput from "../common/Inputs";
import "./logIn.scss";
import { useLoginMutation } from "../../redux/slices/usersApiSlice";
import { setCredentials } from "../../redux/slices/authSlice";
import { RootState } from "../../redux/store";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/dashboard");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res?.body }));
      toast.dark("تم تسجيل الدخول بنجاح");
      navigate("/");
    } catch (err) {
      toast.error(err?.body?.message || err.error);
      console.error(err);
    }
  };

  return (
    <div className="login">
      <form onSubmit={submitHandler} className="hero">
        <h2>تسجيل الدخول</h2>
        <div className="card">
          <TextInput
            label="البريد الالكتروني"
            type="email"
            name="email"
            value={email}
            placeholder="regular@gmail.com"
            onChange={(e) => {
              setEmail(e.target.value);
              e.target.setCustomValidity("");
            }}
            pattern="^[a-zA-Z0-9._%\+\-]+@[a-zA-Z0-9._%\+\-]+\.[a-z]{2,}$"
            onInvalid={(e) =>
              (e.target as HTMLInputElement).setCustomValidity(
                "الرجاء إدخال بريد إليكتروني صحيح",
              )
            }
            required={true}
          />
          <TextInput
            label="الرمز السري"
            type="password"
            name="password"
            value={password}
            placeholder="********"
            onChange={(e) => setPassword(e.target.value)}
            required={true}
          />
          {isLoading && <p>جاري التحميل...</p>}
          <Button type="submit" className="Button--medium Button--success">
            تسجيل الدخول
          </Button>
        </div>
        <Link to="/signUp" className="small no-account">
          ليس لديك حساب؟
        </Link>
      </form>
    </div>
  );
}
