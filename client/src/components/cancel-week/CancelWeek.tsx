import { FormEvent, useState } from "react";
import PageTitle from "../common/PageTitle";
import CustomCheckbox from "../common/CustomCheckbox";
import Button from "../common/Button";
import "./CancelWeek.scss";
import { useCancelWeekMutation } from "../../redux/slices/termApiSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function CancelWeek() {
  const [understandCheckbox, setUnderstandCheckbox] = useState(false);

  const [cancelWeek, { isLoading }] = useCancelWeekMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await cancelWeek({}).unwrap();
      if (res.status === 400 || res.status === 500)
        throw new Error("Something went wrong while canceling the week");
      toast.success("تم إلغاء الأسبوع بنجاح");
      navigate("/dashboard");
    } catch (err) {
      toast.error("حدث خطأ أثناء إلغاء الأسبوع");
      toast.error(err?.data?.arabicMessage);
      console.log(err?.data?.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="cancel-week container">
      <PageTitle title="إلغاء الأسبوع" />
      <h4>هل أنت متأكد من إلغاء الأسبوع؟</h4>
      <p>إلغاء الاسبوع قرار مهم و لا يمكن التراجع عنه</p>
      <CustomCheckbox
        labels={["لقد فهمت"]}
        values={["understand"]}
        checkedValues={understandCheckbox ? ["understand"] : []}
        onChange={(e) => setUnderstandCheckbox(e.target.checked)}
        name="understand"
        required
      />
      <Button
        className="cancel-week__btn Button--medium Button--danger"
        type="submit"
      >
        إلغاء الأسبوع
      </Button>
      {isLoading && <p>جاري إلغاء الأسبوع</p>}
    </form>
  );
}
