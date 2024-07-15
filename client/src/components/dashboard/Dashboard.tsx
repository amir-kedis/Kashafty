import PageTitle from "../common/PageTitle";
import "./Dashboard.scss";
import { useSelector } from "react-redux";
import NotificationBox from "../common/NotificationBox";
import TermInfoSection from "../common/TermInfoSection";
import UserActions from "../common/UserActions";
import InfoSection from "../common/InfoSection";
import { RootState } from "../../redux/store";

export default function Dashboard() {
  const { userInfo } = useSelector((state: RootState) => state.auth);

  let titleMsg =
    userInfo.gender == "male"
      ? `مرحباً يا كابتن ${userInfo?.firstName} ${userInfo?.middleName}`
      : `مرحبا يا شيفتان ${userInfo?.firstName} ${userInfo?.middleName}`;

  return (
    <div className="dashboard">
      <PageTitle title={titleMsg} />
      <section className="dashboard__section container">
        <h4 className="section__heading">إشعارات</h4>
        <NotificationBox />
      </section>
      <section className="dashboard__section container">
        <h4 className="section__heading">معلومات</h4>
        <InfoSection />
      </section>
      <section className="dashboard__section container">
        <h4 className="section__heading">الفترة الحالية</h4>
        <TermInfoSection />
      </section>
      <section className="dashboard__section container ">
        <h4 className="section__heading">إجراءات</h4>
        <UserActions />
      </section>
    </div>
  );
}
