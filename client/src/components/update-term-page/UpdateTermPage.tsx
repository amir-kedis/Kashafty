import { useEffect, useState } from "react";
import PageTitle from "../common/PageTitle";
import TextInput from "../common/Inputs";
import Button from "../common/Button";
import CustomCheckbox from "../common/CustomCheckbox";
import "../insert-term/InsertTermPage.scss";
import {
  useUpdateTermMutation,
  useGetCurTermQuery,
} from "../../redux/slices/termApiSlice";
import { toast } from "react-toastify";

export default function UpdateTermPage() {
  const [termName, setTermName] = useState("");
  const [termStartDate, setTermStartDate] = useState("");
  const [termEndDate, setTermEndDate] = useState("");
  const [understandCheckbox, setUnderstandCheckbox] = useState(false);

  const [updateTerm, { isLoading }] = useUpdateTermMutation();

  const { data, isFetching: isFetchingTerm } = useGetCurTermQuery({});

  useEffect(() => {
    if (data && data.body) {
      setTermName(data.body.termName);
      let date = new Date(data.body.startDate).toISOString().split("T")[0];
      setTermStartDate(date);
      date = new Date(data.body.endDate).toISOString().split("T")[0];
      setTermEndDate(date);
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: send request with this info to the server
    console.log({
      termName,
      startDate: termStartDate,
      endDate: termEndDate,
      understandCheckbox,
    });
    try {
      const res = updateTerm({
        termName,
        startDate: termStartDate,
        endDate: termEndDate,
      }).unwrap();
      toast.success("تم تعديل الفترة بنجاح");
    } catch (err) {
      console.log(err);
      toast.error("حدث خطأ أثناء تعديل الفترة");
      toast.error(err?.data?.arabicMessage);
      console.log(err?.data?.message);
    }
  };

  return (
    <div className="insert-term container">
      <PageTitle title="تعديل الفترة" />
      {isFetchingTerm && (
        <p
          style={{
            textAlign: "center",
          }}
        >
          جاري تحميل الفترة
        </p>
      )}
      <form className="insert-term__form" onSubmit={handleSubmit}>
        <TextInput
          label="اسم الفترة"
          type="text"
          name="termName"
          value={termName}
          onChange={(e) => setTermName(e.target.value)}
          placeholder="اسم الفترة"
          required
        />
        <TextInput
          label="تاريخ بداية الفترة"
          type="date"
          name="termStartDate"
          value={termStartDate}
          onChange={(e) => setTermStartDate(e.target.value)}
          placeholder="تاريخ بداية الفترة"
          required
        />
        <TextInput
          label="تاريخ نهاية الفترة"
          type="date"
          name="termEndDate"
          value={termEndDate}
          onChange={(e) => setTermEndDate(e.target.value)}
          placeholder="تاريخ نهاية الفترة"
          required
        />
        <p className="insert-term__note">
          **إنشاء فترة هو إجراء لا رجعة به يجب مراعاة أنه بعد إنشاء الفترة
          ستتحول كل الصفحات الأخرى إلى أحدث فترة تم إنشاؤها
        </p>
        <CustomCheckbox
          labels={["لقد فهمت"]}
          values={["understand"]}
          checkedValues={understandCheckbox ? ["understand"] : []}
          onChange={(e) => setUnderstandCheckbox(e.target.checked)}
          name="understand"
          required
        />
        <Button
          className="insert-term__btn Button--medium Button--primary-darker"
          type="submit"
        >
          تعديل الفترة
        </Button>
      </form>
      {isLoading && (
        <p
          style={{
            textAlign: "center",
          }}
        >
          جاري تعديل الفترة
        </p>
      )}
    </div>
  );
}
