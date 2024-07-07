import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../common/Button";
import TextInput, { RadioInput } from "../common/Inputs";
import "./signUp.scss";
import { useSignupMutation } from "../../redux/slices/usersApiSlice";
import { setCredentials } from "../../redux/slices/authSlice";
import { RootState } from "../../redux/store";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [signup, { isLoading }] = useSignupMutation();

  const { userInfo } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/dashboard");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== rePassword) {
      toast.error("الرمز السري غير متطابق");
      return;
    }
    try {
      console.log({
        firstName,
        middleName,
        lastName,
        password,
        email,
        phoneNumber: phone,
        gender: gender == "ذكر" ? "male" : "female",
      });
      const res = await signup({
        firstName,
        middleName,
        lastName,
        phoneNumber: phone,
        email,
        password,
        gender: gender == "ذكر" ? "male" : "female",
      }).unwrap();
      dispatch(setCredentials({ ...res?.body }));
      toast.dark(" تم تسجيل الحساب بنجاح");
      navigate("/");
    } catch (err) {
      toast.dark("حدث خطأ ما");
      toast.error(JSON.stringify(err));
      toast.error(err?.data?.message || err.error);
      console.log(err?.data?.message || err.error);
    }
  };

  return (
    <div className="signUp">
      <form onSubmit={submitHandler} className="hero">
        <h2>تسجيل حساب</h2>
        <div className="container">
          <div className="card">
            <h6>الاسم</h6>
            <TextInput
              label="الاسم الأول"
              type="text"
              name="firstName"
              value={firstName}
              placeholder="أكتب أسمك الاول"
              onChange={(e) => {
                setFirstName(e.target.value);
                e.target.setCustomValidity("");
              }}
              pattern="^[\u0621-\u064Aa-zA-Z]+$"
              onInvalid={(e) =>
                (e.target as HTMLInputElement).setCustomValidity(
                  "الرجاء إدخال الاسم الاول فقط (باللغة العربية او الانجليزية)",
                )
              }
              required={true}
            />
            <TextInput
              label="الاسم المتوسط"
              type="text"
              name="middleName"
              value={middleName}
              placeholder="أكتب أسمك المتوسط"
              onChange={(e) => {
                setMiddleName(e.target.value);
                e.target.setCustomValidity("");
              }}
              pattern="^[\u0621-\u064Aa-zA-Z]+$"
              onInvalid={(e) =>
                (e.target as HTMLInputElement).setCustomValidity(
                  "الرجاء إدخال الاسم الاوسط فقط (باللغة العربية او الانجليزية)",
                )
              }
              required={true}
            />
            <TextInput
              label="الاسم الأخير"
              type="text"
              name="lastName"
              value={lastName}
              placeholder="أكتب أسمك الأخير"
              onChange={(e) => {
                setLastName(e.target.value);
                e.target.setCustomValidity("");
              }}
              pattern="^[\u0621-\u064Aa-zA-Z]+$"
              onInvalid={(e) =>
                (e.target as HTMLInputElement).setCustomValidity(
                  "الرجاء إدخال الاسم الأخير فقط (باللغة العربية او الانجليزية)",
                )
              }
              required={true}
            />
          </div>
          <div className="card">
            <h6>معلومات الحساب</h6>
            <TextInput
              label="البريد الالكتروني"
              type="email"
              name="email"
              value={email}
              placeholder="some@gmail.com"
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
              placeholder="أكتب الرمز السري"
              onChange={(e) => setPassword(e.target.value)}
              required={true}
            />
            <TextInput
              label="أعد إدخال الرمز السري"
              type="password"
              name="rePassword"
              value={rePassword}
              placeholder="أعد إدخال الرمز السري"
              onChange={(e) => setRePassword(e.target.value)}
              required={true}
            />
          </div>
          <div className="card">
            <h6>معلومات أخرى</h6>
            <TextInput
              label="رقم الهاتف"
              type="text"
              name="phone"
              value={phone}
              placeholder="أكتب رقم هاتفك"
              onChange={(e) => {
                setPhone(e.target.value);
                e.target.setCustomValidity("");
              }}
              pattern="^01[0-9]{9}$"
              onInvalid={(e) =>
                (e.target as HTMLInputElement).setCustomValidity(
                  "الرجاء إدخال رقم هاتف صحيح",
                )
              }
              required={true}
            />
            <RadioInput
              label="النوع"
              name="gender"
              valuesArr={["ذكر", "أنثى"]}
              onChange={(e) => setGender(e.target.value)}
              required={true}
            />
          </div>
          {isLoading && <p>جاري التحميل...</p>}
          <Button type="submit" className="Button--success Button-medium">
            تسجيل
          </Button>
        </div>
      </form>
    </div>
  );
}
