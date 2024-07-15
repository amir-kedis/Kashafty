import { useGetTotalScoutsQuery } from "../../redux/slices/stat/stat.logistics.slice";
import InfoBox from "../common/InfoBox";

type TotalScoutsChipProps = {
  label: string;
  color?: "dark" | "purple" | "colorful";
  spans?: boolean;
};

const TotalScoutsChip = ({ label, color, spans }: TotalScoutsChipProps) => {
  const { isLoading, isError, data } = useGetTotalScoutsQuery({});
  return (
    <InfoBox
      title={label}
      value={
        isLoading
          ? "جاري التحميل"
          : isError
            ? "لا يوجد بيانات"
            : data.totalScouts
      }
      color={color}
      spans={spans}
    ></InfoBox>
  );
};

export default TotalScoutsChip;
