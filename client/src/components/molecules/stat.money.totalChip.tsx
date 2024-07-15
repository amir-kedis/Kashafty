import { useGetTotalMoneyQuery } from "../../redux/slices/stat/stat.money.slice";
import InfoBox from "../common/InfoBox";

type TotalMoneyChipProps = {
  label: string;
  color?: "dark" | "purple" | "colorful";
  spans?: boolean;
};

const TotalMoneyChip = ({ label, color, spans }: TotalMoneyChipProps) => {
  const { isLoading, isError, data } = useGetTotalMoneyQuery();
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

export default TotalMoneyChip;
