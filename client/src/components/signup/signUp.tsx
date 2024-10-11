import { useState, useEffect, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../common/Button";
import TextInput, { RadioInput } from "../common/Inputs";
import "./signUp.scss";
import { useSignupMutation } from "../../redux/slices/usersApiSlice";
import { setCredentials } from "../../redux/slices/authSlice";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import useSignIn from "react-auth-kit/hooks/useSignIn";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState(""); // Email is optional
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [signup, { isLoading }] = useSignupMutation();
  const isAuthenticated = useIsAuthenticated();
  const signIn = useSignIn();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [navigate, isAuthenticated]);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== rePassword) {
      toast.error("الرمز السري غير متطابق");
      return;
    }
    try {
      console.log({
        firstName: firstName.trim(),
        middleName: middleName.trim(),
        lastName: lastName.trim(),
        password,
        email, // Email can be empty
        phoneNumber: phone,
        gender: gender === "ذكر" ? "male" : "female",
      });
      const res = await signup({
        firstName: firstName.trim(),
        middleName: middleName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phone,
        email: email || undefined, // Send email as undefined if it's empty
        password,
        gender: gender === "ذكر" ? "male" : "female",
      }).unwrap();

      if (
        signIn({
          auth: {
            token: res.token,
            type: "Bearer",
          },
          userState: res.body,
        })
      ) {
        dispatch(setCredentials({ ...res?.body }));
        toast.dark(" تم تسجيل الحساب بنجاح");
        navigate("/");
      }
    } catch (err) {
      toast.dark("حدث خطأ ما");
      toast.error(err?.data?.arabicMessage);
      console.log(err?.data?.message);
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
              placeholder="اكتب اسمك الأول"
              onChange={(e) => {
                setFirstName(e.target.value);
                e.target.setCustomValidity("");
              }}
              pattern="^\s*[\u0621-\u064Aa-zA-Z]+(?:\s+[\u0621-\u064Aa-zA-Z]+)*\s*$"
              onInvalid={(e) =>
                (e.target as HTMLInputElement).setCustomValidity(
                  "الرجاء إدخال الاسم الأول فقط (باللغة العربية أو الإنجليزية)",
                )
              }
              required
            />
            <TextInput
              label="الاسم المتوسط"
              type="text"
              name="middleName"
              value={middleName}
              placeholder="اكتب اسمك المتوسط"
              onChange={(e) => {
                setMiddleName(e.target.value);
                e.target.setCustomValidity("");
              }}
              pattern="^\s*[\u0621-\u064Aa-zA-Z]+(?:\s+[\u0621-\u064Aa-zA-Z]+)*\s*$"
              onInvalid={(e) =>
                (e.target as HTMLInputElement).setCustomValidity(
                  "الرجاء إدخال الاسم الأوسط فقط (باللغة العربية أو الإنجليزية)",
                )
              }
              required
            />
            <TextInput
              label="الاسم الأخير"
              type="text"
              name="lastName"
              value={lastName}
              placeholder="اكتب اسمك الأخير"
              onChange={(e) => {
                setLastName(e.target.value);
                e.target.setCustomValidity("");
              }}
              pattern="^\s*[\u0621-\u064Aa-zA-Z]+(?:\s+[\u0621-\u064Aa-zA-Z]+)*\s*$"
              onInvalid={(e) =>
                (e.target as HTMLInputElement).setCustomValidity(
                  "الرجاء إدخال الاسم الأخير فقط (باللغة العربية أو الإنجليزية)",
                )
              }
              required
            />
          </div>
          <div className="card">
            <h6>معلومات الحساب</h6>
            <TextInput
              label="البريد الإلكتروني"
              type="email"
              name="email"
              value={email}
              placeholder="some@gmail.com"
              onChange={(e) => {
                setEmail(e.target.value);
                e.target.setCustomValidity("");
              }}
              pattern="^[a-zA-Z0-9._%\+\-]*@[a-zA-Z0-9._%\+\-]*\.[a-z]*$" // Updated pattern to handle optional email
              onInvalid={(e) =>
                (e.target as HTMLInputElement).setCustomValidity(
                  "الرجاء إدخال بريد إليكتروني صحيح",
                )
              }
            />
            <TextInput
              label="الرمز السري"
              type="password"
              name="password"
              value={password}
              placeholder="اكتب الرمز السري"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <TextInput
              label="أعد إدخال الرمز السري"
              type="password"
              name="rePassword"
              value={rePassword}
              placeholder="أعد إدخال الرمز السري"
              onChange={(e) => setRePassword(e.target.value)}
              required
            />
          </div>
          <div className="card">
            <h6>معلومات أخرى</h6>
            <TextInput
              label="رقم الهاتف"
              type="text"
              name="phone"
              value={phone}
              placeholder="اكتب رقم هاتفك"
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
              required
            />
            <RadioInput
              label="النوع"
              name="gender"
              valuesArr={["ذكر", "أنثى"]}
              checkedValue={gender}
              onChange={(e) => {
                setGender(e.target.value);
              }}
              required
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
