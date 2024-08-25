import "../../assets/styles/components/InfoSection.scss";
import InfoBox from "./InfoBox";
import { useGetCaptainsQuery } from "../../redux/slices/captainsApiSlice";
import {
  useGetAbsenceRateQuery,
  useGetSectorAbsenceRateQuery,
} from "../../redux/slices/statsApiSlice";
import {
  useGetAllScoutsCountQuery,
  useGetScoutsInSectorQuery,
} from "../../redux/slices/scoutApiSlice";
import {
  useGetBudgetQuery,
  useGetSectorSubscriptionQuery,
} from "../../redux/slices/financeApiSlice";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

export default function InfoSection() {
  const userInfo = useAuthUser();
  const { type } = userInfo;

  const GeneralCaptainInfo = () => {
    const { data: captains, isFetching } = useGetCaptainsQuery({});
    const captainCount = captains?.body.length;

    const { data: absenceRate, isFetching: isFetchingAbsence } =
      useGetAbsenceRateQuery({});

    const { data: scouts, isFetching: isFetchingScoutsCount } =
      useGetAllScoutsCountQuery({});

    const { data: budget, isFetching: isFetchingBudget } = useGetBudgetQuery(
      {},
    );

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
    const { data: absenceRate, isFetching: isFetchingAbsence } =
      useGetSectorAbsenceRateQuery({
        sectorBaseName: userInfo.rSectorBaseName,
        sectorSuffixName: userInfo.rSectorSuffixName,
      });

    const { data: scouts, isFetching: isFetchingScoutsCount } =
      useGetScoutsInSectorQuery({
        sectorBaseName: userInfo.rSectorBaseName,
        sectorSuffixName: userInfo.rSectorSuffixName,
      });

    const { data: budget, isFetching: isFetchingBudget } =
      useGetSectorSubscriptionQuery({
        sectorBaseName: userInfo.rSectorBaseName,
        sectorSuffixName: userInfo.rSectorSuffixName,
      });

    return (
      <>
        <InfoBox
          title="نسبة غياب قطاعك"
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
          title="اشتراك الاسبوع الحالي"
          value={isFetchingBudget ? "جاري التحميل" : budget.body}
          spans
          color="purple"
        />
      </>
    );
  };

  const UnitCaptainInfo = () => {
    const { data: captains, isFetching } = useGetCaptainsQuery({});
    const captainCount = captains?.body.length;

    const { data: absenceRate, isFetching: isFetchingAbsence } =
      useGetAbsenceRateQuery({});

    const { data: scouts, isFetching: isFetchingScoutsCount } =
      useGetAllScoutsCountQuery({});

    return (
      <>
        <InfoBox
          title="متوسط نسبة الغياب"
          value={
            isFetchingAbsence
              ? "جاري التحميل"
              : !absenceRate
                ? "لا يوجد بيانات"
                : Math.round(absenceRate?.body * 100) + "%"
          }
          color="dark"
          spans
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
