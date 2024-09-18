import { AttendanceTable } from "./AttendanceTable";

type Props = {
  attendance: any;
  setAttendance: any;
  isLoading: boolean;
  isError: boolean;
};

function UnitCaptainsTable({
  attendance,
  setAttendance,
  isLoading,
  isError,
}: Props) {
  const handleCheckboxChange = (captainId, checkboxType) => {
    setAttendance((prevState) =>
      prevState.map((captain) =>
        captainId === captain.captainId
          ? {
              ...captain,
              attendanceStatus:
                captain?.attendanceStatus === checkboxType
                  ? "absent"
                  : checkboxType,
              present:
                checkboxType === "attended"
                  ? !captain.present
                  : captain.present,
              excused:
                checkboxType === "execused"
                  ? !captain.excused
                  : captain.excused,
            }
          : captain
      )
    );
  };

  return (
    <div>
      {!isLoading && !isError && (
        <AttendanceTable
          attendance={attendance || []}
          handleCheckboxChange={handleCheckboxChange}
        />
      )}
    </div>
  );
}

export default UnitCaptainsTable;
