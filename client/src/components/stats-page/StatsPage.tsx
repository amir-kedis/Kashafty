import PageTitle from "../common/PageTitle";
import GroupInfo from "./GroupInfo";
import "./StatsPage.scss";
import AttendanceStatSection from "../organisms/stat.attendance.section";
import MoneyStatSection from "../organisms/stat.money.section";

export default function StatsPage() {
  return (
    <div className="stats-page container">
      <PageTitle title="الاحصائيات" />
      <AttendanceStatSection />
      <MoneyStatSection />
      <GroupInfo />
    </div>
  );
}
