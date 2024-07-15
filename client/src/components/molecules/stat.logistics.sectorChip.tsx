import { useGetTotalSectorsQuery } from "../../redux/slices/stat/stat.logistics.slice";
import InfoBox from "../common/InfoBox";

type TotalSectorsChipProps = {
  label: string;
  color?: "dark" | "purple" | "colorful";
  spans?: boolean;
};

const TotalSectorsChip = ({ label, color, spans }: TotalSectorsChipProps) => {
  const { isLoading, isError, data } = useGetTotalSectorsQuery();
  return (
    <InfoBox
      title={label}
      value={
        isLoading
          ? "جاري التحميل"
          : isError
            ? "لا يوجد بيانات"
            : data.totalSectors
      }
      color={color}
      spans={spans}
    ></InfoBox>
  );
};

export default TotalSectorsChip;
