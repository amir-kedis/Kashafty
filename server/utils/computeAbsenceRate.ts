type Absence = {
  absence_count: string;
  attendance_count: string;
};

type Attendance = {
  attendance_count: string | number;
  absence_count: string | number;
};

const computeAbsenceRate = (absence: Absence) => {
  const absenceRecordsCount = Number(absence.absence_count);
  const attendanceRecordsCount = Number(absence.attendance_count);

  if (absenceRecordsCount + attendanceRecordsCount === 0) {
    return null;
  }

  const absenceRate =
    absenceRecordsCount / (absenceRecordsCount + attendanceRecordsCount);
  return absenceRate;
};

const computeAttendanceRate = (attendance: Attendance) => {
  const attendanceRecordsCount = Number(attendance.attendance_count);
  const absenceRecordsCount = Number(attendance.absence_count);

  if (absenceRecordsCount + attendanceRecordsCount === 0) {
    return null;
  }

  const attendanceRate =
    attendanceRecordsCount / (absenceRecordsCount + attendanceRecordsCount);
  return attendanceRate;
};

export { computeAbsenceRate, computeAttendanceRate };
