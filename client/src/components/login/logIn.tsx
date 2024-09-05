import { useState, useEffect, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { toast } from "react-toastify";
import Button from "../common/Button";
import TextInput from "../common/Inputs";
import "./logIn.scss";
import { useLoginMutation } from "../../redux/slices/usersApiSlice";
import { setCredentials } from "../../redux/slices/authSlice";

export default function LogIn() {
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signIn = useSignIn();
  const isAuthenticated = useIsAuthenticated();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ emailOrMobile, password }).unwrap();

      // res.expiresIn is '60d'
      const expiresDate = new Date();
      expiresDate.setDate(expiresDate.getDate() + parseInt(res?.expiresIn));

      if (
        signIn({
          auth: {
            token: res?.token,
            type: "Bearer",
            expiresAt: expiresDate,
          },
          userState: res?.body,
        })
      ) {
        dispatch(setCredentials({ ...res?.body }));
        toast.dark("تم تسجيل الدخول بنجاح");
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err?.data?.arabicMessage);
      console.log(err?.data?.message);
    }
  };

  return (
    <div className="login">
      <form onSubmit={submitHandler} className="hero">
        <h2>تسجيل الدخول</h2>
        <div className="card">
          <TextInput
            label="البريد الالكتروني أو رقم الهاتف"
            type="text"
            name="emailOrMobile"
            value={emailOrMobile}
            placeholder="regular@gmail.com or 01001234000"
            onChange={(e) => {
              setEmailOrMobile(e.target.value);
              e.target.setCustomValidity("");
            }}
            required={true}
            dir="ltr"
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
