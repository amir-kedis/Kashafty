import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import "../../assets/styles/components/UserActions.scss";
import Button from "./Button";
import Tooltip from "../atoms/Tooltip";

const ActionRoutes = {
  "Assign Sector Leader": "/assign-captain",
  "Add Sector": "/add-sector",
  "Add Scout": "/add-scout",
  Statistics: "/stats",
  "Financial Management": "/finance",
  "Send Notification": "/send-notification",
  "Edit Scout": "/update-scout",
  "Reports and Councils": "/reports-and-councils",
  Activities: "/activities",
  Sessions: "/sessions",
  "Start New Term": "/start-new-term",
  Sectors: "/sectors",
  "Record Captain Absence": "/record-captains-absence",
  "Record Scouts Absence": "/record-scouts-absence",
  Scores: "/scores",
  Sector: "/sector",
  "Delete Scout": "/delete-scout",
};

const SparkleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="sparkle-icon"
  >
    <path d="M12 3l1.88 5.76a1 1 0 0 0 .95.69h6.08a1 1 0 0 1 .59 1.8l-4.93 3.58a1 1 0 0 0-.36 1.12l1.88 5.76a1 1 0 0 1-1.54 1.12l-4.93-3.58a1 1 0 0 0-1.18 0l-4.93 3.58a1 1 0 0 1-1.54-1.12l1.88-5.76a1 1 0 0 0-.36-1.12l-4.93-3.58a1 1 0 0 1 .59-1.8h6.08a1 1 0 0 0 .95-.69L12 3z" />
  </svg>
);

const NewFeatureButton = ({ linkTo, className, children }) => (
  <Tooltip text="ميزة جديدة!">
    <div className="new-feature-button-wrapper">
      <Button linkTo={linkTo} className={className}>
        <div className="button-content">
          <SparkleIcon />
          <span>{children}</span>
        </div>
      </Button>
    </div>
  </Tooltip>
);

export default function UserActions() {
  const userInfo = useAuthUser();
  const { type } = userInfo;

  const GeneralCaptainActions = () => {
    return (
      <>
        <Button
          linkTo={ActionRoutes["Assign Sector Leader"]}
          className="Button--medium Button--primary-darker"
        >
          تعيين قائد لقطاع
        </Button>
        <Button
          linkTo={ActionRoutes["Add Sector"]}
          className="Button--medium Button--regular"
        >
          إضافة قطاع
        </Button>
        <Button
          linkTo={ActionRoutes["Add Scout"]}
          className="Button--medium Button--regular"
        >
          إضافة كشاف
        </Button>
        <Button
          linkTo={ActionRoutes.Statistics}
          className="Button--medium Button--regular"
        >
          الاحصائيات
        </Button>
        <Button
          linkTo={ActionRoutes["Financial Management"]}
          className="Button--medium Button--regular"
        >
          إدارة الماليات
        </Button>
        <Button
          linkTo={ActionRoutes["Send Notification"]}
          className="Button--medium Button--regular"
        >
          إرسال إشعار
        </Button>
        <Button
          linkTo={ActionRoutes["Edit Scout"]}
          className="Button--medium Button--regular"
        >
          تعديل كشاف
        </Button>
        <Button
          disabled
          linkTo={ActionRoutes["Reports and Councils"]}
          className="Button--medium Button--regular"
        >
          التقارير والمجالس
        </Button>
        <Button
          linkTo={ActionRoutes["Activities"]}
          className="Button--medium Button--regular"
        >
          الأنشطة
        </Button>
        <Button
          disabled
          linkTo={ActionRoutes["Sessions"]}
          className="Button--medium Button--regular"
        >
          المواضيع
        </Button>
        <NewFeatureButton
          linkTo={ActionRoutes["Delete Scout"]}
          className="Button--medium Button--regular"
        >
          حذف كشاف
        </NewFeatureButton>
        <Button
          linkTo={ActionRoutes["Start New Term"]}
          className="Button--medium span-2-cols Button--success"
        >
          بدء فترة جديدة
        </Button>
      </>
    );
  };

  const UnitCaptainActions = () => {
    return (
      <>
        <Button
          linkTo={ActionRoutes["Assign Sector Leader"]}
          className="Button--medium Button--primary-darker"
        >
          تعيين قائد لقطاع
        </Button>
        <Button
          linkTo={ActionRoutes["Statistics"]}
          className="Button--medium Button--regular"
        >
          الاحصائيات
        </Button>
        <Button
          linkTo={ActionRoutes["Send Notification"]}
          className="Button--medium Button--regular"
        >
          إرسال إشعار
        </Button>
        <Button
          linkTo={ActionRoutes["Add Scout"]}
          className="Button--medium Button--regular"
        >
          إضافة كشاف
        </Button>
        <NewFeatureButton
          linkTo={ActionRoutes["Delete Scout"]}
          className="Button--medium Button--regular"
        >
          حذف كشاف
        </NewFeatureButton>
        <Button
          linkTo={ActionRoutes["Edit Scout"]}
          className="Button--medium Button--regular"
        >
          تعديل كشاف
        </Button>
        <Button
          disabled
          linkTo={ActionRoutes["Reports and Councils"]}
          className="Button--medium Button--regular"
        >
          التقارير والمجالس
        </Button>
        <Button
          linkTo={ActionRoutes["Activities"]}
          className="Button--medium Button--regular"
        >
          الأنشطة
        </Button>
        <Button
          disabled
          linkTo={ActionRoutes["Sessions"]}
          className="Button--medium Button--regular"
        >
          المواضيع
        </Button>
        <Button
          disabled
          linkTo={ActionRoutes["Sectors"]}
          className="Button--medium span-2-cols Button--regular"
        >
          القطاعات
        </Button>
        <Button
          linkTo={ActionRoutes["Record Captain Absence"]}
          className="Button--medium span-2-cols Button--success"
        >
          تسجيل غياب القادة
        </Button>
      </>
    );
  };

  const RegularCaptainActions = () => {
    return (
      <>
        <Button
          linkTo={ActionRoutes["Statistics"]}
          className="Button--medium span-2-cols Button--regular"
        >
          الاحصائيات
        </Button>
        <Button
          linkTo={ActionRoutes["Edit Scout"]}
          className="Button--medium Button--regular"
        >
          تعديل كشاف
        </Button>
        <Button
          disabled
          linkTo={ActionRoutes["Reports and Councils"]}
          className="Button--medium Button--regular"
        >
          التقارير والمجالس
        </Button>
        <Button
          linkTo={ActionRoutes["Activities"]}
          className="Button--medium Button--regular"
        >
          الأنشطة
        </Button>
        <Button
          disabled
          linkTo={ActionRoutes["Sessions"]}
          className="Button--medium Button--regular"
        >
          المواضيع
        </Button>
        <Button
          disabled
          linkTo={ActionRoutes["Scores"]}
          className="Button--medium Button--regular"
        >
          تقييم أفراد
        </Button>
        <Button
          disabled
          linkTo={ActionRoutes["Sector"]}
          className="Button--medium Button--regular"
        >
          القطاع
        </Button>
        <Button
          linkTo={ActionRoutes["Record Scouts Absence"]}
          className="Button--medium span-2-cols Button--success"
        >
          تسجيل غياب الأفراد
        </Button>
      </>
    );
  };

  return (
    <div className="userActions">
      <div className="userActions__container ">
        {{
          general: <GeneralCaptainActions />,
          unit: <UnitCaptainActions />,
          regular: <RegularCaptainActions />,
        }[type] || <p>لا يوجد أي إجراءات متاحة</p>}
      </div>
    </div>
  );
}
