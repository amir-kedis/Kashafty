import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import TotalMoneyChip from "../molecules/stat.money.totalChip";
import TotalIncomeChip from "../molecules/stat.money.totalIncome";
import TotalExpenseChip from "../molecules/stat.money.totalExpense";
import CurWeekSubChip from "../molecules/stat.money.curWeekSub";

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
    </div>
  );
};

export default MoneyStatSection;
