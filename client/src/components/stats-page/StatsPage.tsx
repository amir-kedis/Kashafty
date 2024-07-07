import PageTitle from "../common/PageTitle";
import InfoSectionMoneyPage from "../moneypage/InfoSectionMoneyPage";
import GroupInfo from "./GroupInfo";
import AbsenceInfo from "./AbsenceInfo";
import "./StatsPage.scss";

export default function StatsPage() {
  return (
    <div className="stats-page container">
      <PageTitle title="الاحصائيات" />
      <AbsenceInfo />
      <InfoSectionMoneyPage />
      <GroupInfo />
    </div>
  );
}
