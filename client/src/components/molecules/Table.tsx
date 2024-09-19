import { AttendanceTable } from "./AttendanceTable";

type Props = {
  attendance: any;
  setAttendance: any;
  isLoading: boolean;
  isError: boolean;
  attendanceType: "captain" | "scout";
};

function Table({
  attendance,
  setAttendance,
  isLoading,
  isError,
  attendanceType,
}: Props) {
  const handleCheckboxChange = (id, checkboxType) => {
    setAttendance((prevState) =>
      prevState.map((type) =>
        id === type.id
          ? {
              ...type,
              attendanceStatus:
                type?.attendanceStatus === checkboxType
                  ? "absent"
                  : checkboxType,
              present:
                checkboxType === "attended" ? !type.present : type.present,
              excused:
                checkboxType === "execused" ? !type.excused : type.excused,
            }
          : type
      )
    );
  };

  return (
    <div>
      {!isLoading && !isError && (
        <AttendanceTable
          attendanceType={attendanceType}
          attendance={attendance || []}
          handleCheckboxChange={handleCheckboxChange}
        />
      )}
      {isLoading && <p style={{ margin: "1rem 0" }}>جاري التحميل...</p>}
    </div>
  );
}

export default Table;
