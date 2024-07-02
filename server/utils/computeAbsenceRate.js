const computeAbsenceRate = (absence) => {
  const absenceRecordsCount = Number(absence.absence_count);
  const attendanceRecordsCount = Number(absence.attendance_count);

  if (absenceRecordsCount + attendanceRecordsCount === 0) {
    return null;
  }

  const absenceRate =
    absenceRecordsCount / (absenceRecordsCount + attendanceRecordsCount);
  return absenceRate;
};

const computeAttendanceRate = (attendance) => {
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
