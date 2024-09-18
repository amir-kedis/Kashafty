import InfoBox from "../common/InfoBox";

export default function CaptainAttendanceInfo({ attendance }) {
  const numberOfCheckedPresent =
    attendance.filter((captain) => captain.attendanceStatus === "attended")
      ?.length || 0;

  return (
    <div className="info-section attendance-info-section">
      <InfoBox title="العدد الكلي" value={attendance.length} />
      <InfoBox title="الحضور" value={attendance && numberOfCheckedPresent} />
      <InfoBox
        title="نسبة الحضور"
        value={
          attendance.length > 0
            ? Math.round((numberOfCheckedPresent / attendance.length) * 100) +
              "%"
            : "0%"
        }
      />
      <InfoBox
        title="الغياب"
        value={attendance?.length - numberOfCheckedPresent}
      />
    </div>
  );
}
