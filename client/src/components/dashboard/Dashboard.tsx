import PageTitle from "../common/PageTitle";
import "./Dashboard.scss";
import NotificationBox from "../common/NotificationBox";
import TermInfoSection from "../common/TermInfoSection";
import UserActions from "../common/UserActions";
import InfoSection from "../common/InfoSection";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

export default function Dashboard() {
  const user = useAuthUser();

  let titleMsg =
    user.gender == "male"
      ? `مرحباً يا كابتن ${user?.firstName} ${user?.middleName}`
      : `مرحبا يا شيفتان ${user?.firstName} ${user?.middleName}`;

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
