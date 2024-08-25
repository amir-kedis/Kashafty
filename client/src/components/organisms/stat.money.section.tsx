import TotalMoneyChip from "../molecules/stat.money.totalChip";
import TotalIncomeChip from "../molecules/stat.money.totalIncome";
import TotalExpenseChip from "../molecules/stat.money.totalExpense";
import CurWeekSubChip from "../molecules/stat.money.curWeekSub";
import MoneyLineChart from "../molecules/stat.money.line";
import IncomeExpenseStackedChart from "../molecules/stat.money.stackedchart";
import SubscriptionLineChart from "../molecules/stat.money.subLine";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

type MoneyStatSectionProps = {};

const MoneyStatSection: React.FC = ({}: MoneyStatSectionProps) => {
  const userInfo = useAuthUser();

  if (userInfo?.type !== "general") return <></>;

  return (
    <div style={{ marginBlock: "2rem" }}>
      <h4>الماليات</h4>
      <div className="info-section" style={{ gridTemplateRows: "1fr" }}>
        <TotalMoneyChip label="محتوى الخزنة" color="colorful" />
        <CurWeekSubChip label="اشتراك الاسبوع الحالي" />
        <TotalIncomeChip label="اجمالي الايراد" />
        <TotalExpenseChip label="اجمالي المصروف" />
      </div>
      <MoneyLineChart label="اجمالي الايراد على مدار الفترة" />
      <IncomeExpenseStackedChart label="الايراد والمصروف على مدار الفترة" />
      <SubscriptionLineChart label="الاشتراك الاسبوع على مدار الفترة" />
    </div>
  );
};

export default MoneyStatSection;
