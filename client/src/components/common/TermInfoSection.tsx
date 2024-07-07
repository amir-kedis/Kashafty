import { useSelector } from "react-redux";
import "../../assets/styles/components/TermInfoSection.scss";
import {
  useGetCurTermQuery,
  useGetCurWeekQuery,
  useGetRemainingWeeksQuery,
} from "../../redux/slices/termApiSlice";
import Button from "./Button";
import InfoBox from "./InfoBox";
import { RootState } from "../../redux/store";

export default function TermInfoSection() {
  const { data: termInfo, isFetching: isFetchingTerm } = useGetCurTermQuery({});
  const { data: curWeek, isFetching: isFetchingWeek } = useGetCurWeekQuery({});
  const {
    data: weeksLeft,
    isFetching: isFetchingWeeksLeft,
    isLoading,
  } = useGetRemainingWeeksQuery({});

  const { userInfo } = useSelector((state: RootState) => state.auth);

  // if (
  //   termInfo &&
  //   !isFetchingTerm &&
  //   curWeek &&
  //   !isFetchingWeek &&
  //   weeksLeft &&
  //   !isFetchingWeeksLeft
  // )
  //   console.log({ termInfo, curWeek, weeksLeft });

  return (
    <div
      className="term-info-section"
      style={{
        marginBlock: "1rem",
      }}
    >
      <div className="info-section">
        <InfoBox
          spans={true}
          color="colorful"
          title="اسم الفترة"
          value={
            isFetchingTerm || isLoading
              ? "جاري التحميل"
              : !termInfo
                ? "لا يوجد بيانات"
                : termInfo?.body?.termName
          }
        />
        <InfoBox
          color="dark"
          title="الاسبوع الحالي"
          value={
            isFetchingWeek || isLoading
              ? "جاري التحميل"
              : !curWeek
                ? "0"
                : curWeek?.body?.weekNumber
          }
        />
        <InfoBox
          color="dark"
          title="الاسابيع الباقية"
          value={
            isFetchingWeeksLeft || isLoading
              ? "جاري التحميل"
              : !weeksLeft
                ? "0"
                : weeksLeft?.body
          }
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          marginBlock: "1rem",
        }}
        className="row"
      >
        {userInfo?.type == "general" && (
          <>
            <Button linkTo="/cancel-week" className="Button--danger">
              إلغاء الاسبوع
            </Button>
            <Button linkTo="/edit-term" className="Button--dark">
              تعديل الفترة
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
