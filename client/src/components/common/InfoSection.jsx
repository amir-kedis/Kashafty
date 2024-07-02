import "../../assets/styles/components/InfoSection.scss";
import { useSelector } from "react-redux";
import InfoBox from "./InfoBox";
import { useGetCaptainsQuery } from "../../redux/slices/captainsApiSlice";
import { useGetAbsenceRateQuery } from "../../redux/slices/statsApiSlice";
import { useGetAllScoutsCountQuery } from "../../redux/slices/scoutApiSlice";
import { useGetBudgetQuery } from "../../redux/slices/financeApiSlice";

export default function InfoSection() {
  const { userInfo } = useSelector((state) => state.auth);
  const { type } = userInfo;

  const GeneralCaptainInfo = () => {
    const { data: captains, isFetching } = useGetCaptainsQuery();
    const captainCount = captains?.body.length;

    const { data: absenceRate, isFetching: isFetchingAbsence } =
      useGetAbsenceRateQuery();

    const { data: scouts, isFetching: isFetchingScoutsCount } =
      useGetAllScoutsCountQuery();

    const { data: budget, isFetching: isFetchingBudget } = useGetBudgetQuery();

    if (budget && !isFetchingBudget) console.log(budget);
    if (absenceRate && !isFetchingAbsence) console.log(absenceRate);
    if (scouts && !isFetchingScoutsCount) console.log(scouts);

    return (
      <>
        <InfoBox
          title="محتوى الخزنة"
          value={
            isFetchingBudget
              ? "جاري التحميل"
              : !budget
                ? "لا يوجد بيانات"
                : budget?.body + " جنيه"
          }
          color="purple"
        />
        <InfoBox
          title="متوسط نسبة الحضور"
          value={
            isFetchingAbsence
              ? "جاري التحميل"
              : !absenceRate
                ? "لا يوجد بيانات"
                : Math.round(absenceRate?.body * 100) + "%"
          }
          color="dark"
        />
        <InfoBox
          title="عدد الأفراد"
          value={
            isFetchingScoutsCount
              ? "جاري التحميل"
              : !scouts
                ? "لا يوجد بيانات"
                : scouts?.body?.length
          }
          color="dark"
        />
        <InfoBox
          title="عدد القادة"
          value={
            isFetching
              ? "جاري التحميل"
              : !captainCount
                ? "لا يوجد بيانات"
                : captainCount
          }
          color="dark"
        />
      </>
    );
  };

  const RegularCaptainInfo = () => {
    //TODO: ADD UNIT CAPTAIN DATA INSTEAD OF GLOBAL DATA
    const { data: absenceRate, isFetching: isFetchingAbsence } =
      useGetAbsenceRateQuery();

    const { data: scouts, isFetching: isFetchingScoutsCount } =
      useGetAllScoutsCountQuery();

    return (
      <>
        <InfoBox
          title="متوسط نسبة الغياب"
          value={
            isFetchingAbsence
              ? "جاري التحميل"
              : !absenceRate
                ? "لا يوجد بيانات"
                : absenceRate?.body?.absenceRate + "%"
          }
          color="dark"
        />
        <InfoBox
          title="عدد الأفراد"
          value={
            isFetchingScoutsCount
              ? "جاري التحميل"
              : !scouts
                ? "لا يوجد بيانات"
                : scouts?.body?.length
          }
          color="dark"
        />
      </>
    );
  };

  const UnitCaptainInfo = () => {
    //TODO: ADD UNIT CAPTAIN DATA INSTEAD OF GLOBAL DATA
    const { data: captains, isFetching } = useGetCaptainsQuery();
    const captainCount = captains?.body.length;

    const { data: absenceRate, isFetching: isFetchingAbsence } =
      useGetAbsenceRateQuery();

    const { data: scouts, isFetching: isFetchingScoutsCount } =
      useGetAllScoutsCountQuery();

    return (
      <>
        <InfoBox
          title="متوسط نسبة الغياب"
          value={
            isFetchingAbsence
              ? "جاري التحميل"
              : !absenceRate
                ? "لا يوجد بيانات"
                : absenceRate?.body?.absenceRate + "%"
          }
          color="dark"
          className="span-2-cols"
        />
        <InfoBox
          title="عدد القادة"
          value={
            isFetching
              ? "جاري التحميل"
              : !captainCount
                ? "لا يوجد بيانات"
                : captainCount
          }
          color="dark"
        />
        <InfoBox
          title="عدد الأفراد"
          value={
            isFetchingScoutsCount
              ? "جاري التحميل"
              : !scouts
                ? "لا يوجد بيانات"
                : scouts?.body?.length
          }
          color="dark"
        />
      </>
    );
  };

  return (
    <div className="info-section">
      {type === "general" && <GeneralCaptainInfo />}
      {type === "regular" && <RegularCaptainInfo />}
      {type === "unit" && <UnitCaptainInfo />}
    </div>
  );
}
