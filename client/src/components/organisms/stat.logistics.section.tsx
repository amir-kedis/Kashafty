import TotalCaptainsChip from "../molecules/stat.logistics.captainChip";
import CaptainGenderDistributionChart from "../molecules/stat.logistics.captainsPie";
import TotalScoutsChip from "../molecules/stat.logistics.scoutChip";
import ScoutGenderDistributionChart from "../molecules/stat.logistics.scoutPie";
import TotalSectorsChip from "../molecules/stat.logistics.sectorChip";

type LogisticsStatSectionProps = {};

const LogisticsStatSection: React.FC = ({}: LogisticsStatSectionProps) => {
  return (
    <div style={{ marginBlock: "2rem" }}>
      <h4>معلومات المجموعة</h4>
      <div className="info-section" style={{ gridTemplateRows: "1fr" }}>
        <TotalScoutsChip label="اجمالي عدد الافراد" color="purple" />
        <TotalCaptainsChip label="اجمالي عدد القادة" color="dark" />
        <TotalSectorsChip label="اجمالي عدد القطاعات" spans />
      </div>
      <ScoutGenderDistributionChart label="توزيع الكشافين" />
      <CaptainGenderDistributionChart label="توزيع القادة " />
    </div>
  );
};

export default LogisticsStatSection;
