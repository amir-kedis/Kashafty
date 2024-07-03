import { useState } from "react";
import Button from "../common/Button";
import TextInput from "../common/Inputs";
import "./EditPassword.scss";
import PageTitle from "../common/PageTitle";
import { useChangePasswordMutation } from "../../redux/slices/usersApiSlice";
import { toast } from "react-toastify";

export default function EditPassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log({ oldPassword, newPassword });

    try {
      const res = await changePassword({ oldPassword, newPassword }).unwrap();
      if (res.status === 400 || res.status === 500)
        toast.error("حدث خطأ أثناء تغيير كلمة السر");
      toast.success("تم تغيير كلمة السر بنجاح");
    } catch (err) {
      toast.error("حدث خطأ أثناء تغيير كلمة السر");
      toast.error(err.data.error);
      console.info(err);
    }
  };

  return (
    <form onSubmit={submitHandler} className="edit-password container">
      <PageTitle title="تغيير كلمة السر" />
      <TextInput
        label="الرمز السري القديم"
        type="password"
        name="oldPassword"
        value={oldPassword}
        placeholder="********"
        onChange={(e) => setOldPassword(e.target.value)}
        required={true}
      />
      <TextInput
        label="الرمز السري الجديد"
        type="password"
        name="newPassword"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="********"
        required={true}
      />
      <Button
        className="edit-password__btn Button--medium Button--primary-darker"
        type="submit"
      >
        تغيير كلمة السر
      </Button>
      {isLoading && <p>جاري تغيير كلمة السر</p>}
    </form>
  );
}
