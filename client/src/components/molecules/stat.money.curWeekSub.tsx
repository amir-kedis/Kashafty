import { useGetCurrentWeekSubscriptionQuery } from "../../redux/slices/stat/stat.money.slice";
import InfoBox from "../common/InfoBox";

type curWeekSubChipProps = {
  label: string;
  color?: "dark" | "purple" | "colorful";
  spans?: boolean;
};

const CurWeekSubChip = ({ label, color, spans }: curWeekSubChipProps) => {
  const { isLoading, isError, data } = useGetCurrentWeekSubscriptionQuery();
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

export default CurWeekSubChip;
