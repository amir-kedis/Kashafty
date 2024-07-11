import PageTitle from "../common/PageTitle";
import InfoSectionMoneyPage from "../moneypage/InfoSectionMoneyPage";
import GroupInfo from "./GroupInfo";
import "./StatsPage.scss";
import AttendanceStatSection from "../organisms/stat.attendance.section";

export default function StatsPage() {
  return (
    <div className="stats-page container">
      <PageTitle title="الاحصائيات" />
      <AttendanceStatSection />
      <InfoSectionMoneyPage />
      <GroupInfo />
    </div>
  );
}
