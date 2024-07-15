import { useGetTotalCaptainsQuery } from "../../redux/slices/stat/stat.logistics.slice";
import InfoBox from "../common/InfoBox";

type TotalCaptainsChipProps = {
  label: string;
  color?: "dark" | "purple" | "colorful";
  spans?: boolean;
};

const TotalCaptainsChip = ({ label, color, spans }: TotalCaptainsChipProps) => {
  const { isLoading, isError, data } = useGetTotalCaptainsQuery({});
  return (
    <InfoBox
      title={label}
      value={
        isLoading
          ? "جاري التحميل"
          : isError
            ? "لا يوجد بيانات"
            : data.totalCaptains
      }
      color={color}
      spans={spans}
    ></InfoBox>
  );
};

export default TotalCaptainsChip;
