import { useGetTotalIncomeQuery } from "../../redux/slices/stat/stat.money.slice";
import InfoBox from "../common/InfoBox";

type TotalIncomeChipProps = {
  label: string;
  color?: "dark" | "purple" | "colorful";
  spans?: boolean;
};

const TotalIncomeChip = ({ label, color, spans }: TotalIncomeChipProps) => {
  const { isLoading, isError, data } = useGetTotalIncomeQuery();
  return (
    <InfoBox
      title={label}
      value={
        isLoading
          ? "جاري التحميل"
          : isError
            ? "لا يوجد بيانات"
            : data.totalMoney
      }
      color={color}
      spans={spans}
    ></InfoBox>
  );
};

export default TotalIncomeChip;
