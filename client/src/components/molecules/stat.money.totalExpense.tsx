import { useGetTotalExpenseQuery } from "../../redux/slices/stat/stat.money.slice";
import InfoBox from "../common/InfoBox";

type TotalExpenseChipProps = {
  label: string;
  color?: "dark" | "purple" | "colorful";
  spans?: boolean;
};

const TotalExpenseChip = ({ label, color, spans }: TotalExpenseChipProps) => {
  const { isLoading, isError, data } = useGetTotalExpenseQuery();
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

export default TotalExpenseChip;
