import { useGetAttendaceRateQuery } from "../../redux/slices/stat/stat.attendance.slice";
import InfoBox from "../common/InfoBox";

type AttendanceRateChipProps = {
  label: string;
  sectorBaseName?: string;
  sectorSuffixName?: string;
  unitCaptainId?: number;
};

const AttendanceRateChip = ({
  label,
  sectorBaseName,
  sectorSuffixName,
  unitCaptainId,
}: AttendanceRateChipProps) => {
  const { data, isLoading, isError } = useGetAttendaceRateQuery({
    sectorBaseName,
    sectorSuffixName,
    unitCaptainId,
  });
  return (
    <InfoBox
      title={label}
      value={
        isLoading
          ? "جاري التحميل"
          : isError
            ? "لا يوجد بيانات"
            : Math.round(data?.body * 100) + "%"
      }
      color="dark"
      spans
    ></InfoBox>
  );
};

export default AttendanceRateChip;
