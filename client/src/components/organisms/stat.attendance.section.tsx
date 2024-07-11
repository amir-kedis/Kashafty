import { useSelector } from "react-redux";
import AttendanceRateChip from "../molecules/stat.attendance.rate";
import { RootState } from "../../redux/store";
import AttendanceLineChart from "../molecules/stat.attendance.line";

type AttendanceStatSectionProps = {};

const AttendanceStatSection: React.FC = ({}: AttendanceStatSectionProps) => {
  const { userInfo } = useSelector((state: RootState) => state.auth);

  return (
    <div>
      <h4>الغياب</h4>
      <div className="info-section">
        <AttendanceRateChip label="نسبة حضور المجموعة" />
        {userInfo.type == "unit" ? (
          <AttendanceRateChip
            label="نسبة حضور الوحدة"
            unitCaptainId={userInfo.captainId}
          />
        ) : (
          <AttendanceRateChip
            label="نسبة حضور القطاع"
            sectorBaseName={userInfo.rSectorBaseName}
            sectorSuffixName={userInfo.rSectorSuffixName}
          />
        )}
      </div>
      <div>
        <h6>مخطط نسبة الحضور</h6>
        <AttendanceLineChart
          label="نسبة غياب المجموعة خلال الفترة"
          sectorBaseName={userInfo.rSectorBaseName}
          sectorSuffixName={userInfo.rSectorSuffixName}
        />

        {userInfo.type === "regular" ? (
          <AttendanceLineChart
            label="نسبة حضور القطاع خلال الفترة"
            sectorBaseName={userInfo.rSectorBaseName}
            sectorSuffixName={userInfo.rSectorSuffixName}
          />
        ) : userInfo.type === "unit" ? (
          <AttendanceLineChart
            label="نسبة غياب الوحدة خلال الفترة"
            unitCaptainId={userInfo.captainId}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default AttendanceStatSection;
