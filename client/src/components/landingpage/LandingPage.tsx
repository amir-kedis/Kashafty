import Button from "../common/Button";

import FancyBlobs from "./FancyBlobs";

import PageTitle from "../common/PageTitle";

import "./LandingPage.scss";

import {
  FolderIcon,
  AcademicCapIcon,
  PresentationChartLineIcon,
  PencilSquareIcon,
  BanknotesIcon,
  FlagIcon,
  BellAlertIcon,
} from "@heroicons/react/24/solid";

const features = [
  {
    icon: <FolderIcon />,
    text: "إدارة الغياب والاشتراك الاسبوعي",
  },
  {
    icon: <AcademicCapIcon />,
    text: "تقييم الأفراد ووضع النتائج",
  },
  {
    icon: <PresentationChartLineIcon />,
    text: "وضع الاحصاءيات والتقارير",
  },
  {
    icon: <PencilSquareIcon />,
    text: "تسجيل المواضيع والانشطة المتنوعة",
  },
  {
    icon: <BanknotesIcon />,
    text: "إدارة الماليات والخزنة",
  },
  {
    icon: <FlagIcon />,
    text: "إنشاء التقارير وتسجيل مجالس الشرف",
  },
  {
    icon: <BellAlertIcon />,
    text: "إرسال التنبيهات والاشعارات للقادة",
  },
];

export default function LandingPage() {
  return (
    <div className="landing_page">
      <header className="hero">
        <div className="container">
          <PageTitle title="نظام إدارة الكشافة الحديث" />

          <p>
            نقدم حلول لكل مشاكل اداريات المجموعات من تسجيل الغياب الاشتراكات
            المواضيع التقييم وغيرهم من الامور.
          </p>
          <div className="btn__container">
            <Button className="Button--primary" linkTo="/login">
              تسجيل الدخول
            </Button>
            <Button className="Button--dark" linkTo="/signUp">
              إنشاء حساب
            </Button>
          </div>
        </div>
      </header>
      <section className="features">
        <h2 className="features__title">مميزات</h2>
        {features.map((feature, index) => (
          <div className="feature" key={index}>
            <div className="icon">{feature.icon}</div>
            <p>{feature.text}</p>
          </div>
        ))}

        <FancyBlobs />
      </section>

      {/* uncomment to test statistics Table */}
      {/* <TestTable /> */}
    </div>
  );
}
