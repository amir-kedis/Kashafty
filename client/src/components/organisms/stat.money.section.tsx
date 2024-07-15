import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import TotalMoneyChip from "../molecules/stat.money.totalChip";
import TotalIncomeChip from "../molecules/stat.money.totalIncome";
import TotalExpenseChip from "../molecules/stat.money.totalExpense";
import CurWeekSubChip from "../molecules/stat.money.curWeekSub";
import MoneyLineChart from "../molecules/stat.money.line";
import IncomeExpenseStackedChart from "../molecules/stat.money.stackedchart";
import SubscriptionLineChart from "../molecules/stat.money.subLine";

type MoneyStatSectionProps = {};

const MoneyStatSection: React.FC = ({}: MoneyStatSectionProps) => {
  const { userInfo } = useSelector((state: RootState) => state.auth);

  return (
    <div style={{ marginBlock: "2rem" }}>
      <h4>الماليات</h4>
      <div className="info-section" style={{ gridTemplateRows: "1fr" }}>
        <TotalMoneyChip label="محتوى الخزنة" color="colorful" />
        <CurWeekSubChip label="اشتراك الاسبوع الحالي" />
        <TotalIncomeChip label="اجمالي الدخل" />
        <TotalExpenseChip label="اجمالي الخصوم" />
      </div>
      <MoneyLineChart label="اجمالي الدخل على مدار الفترة" />
      <IncomeExpenseStackedChart label="الدخل والخصم على مدار الفترة" />
      <SubscriptionLineChart label="الاشتراك الاسبوع على مدار الفترة" />
    </div>
  );
};

export default MoneyStatSection;
