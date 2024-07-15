import PageTitle from "../common/PageTitle";
import "./StatsPage.scss";
import AttendanceStatSection from "../organisms/stat.attendance.section";
import MoneyStatSection from "../organisms/stat.money.section";
import LogisticsStatSection from "../organisms/stat.logistics.section";

export default function StatsPage() {
  return (
    <div className="stats-page container">
      <PageTitle title="الاحصائيات" />
      <AttendanceStatSection />
      <MoneyStatSection />
      <LogisticsStatSection />
    </div>
  );
}
