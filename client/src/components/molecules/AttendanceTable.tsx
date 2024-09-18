import React from "react";
import { AttendanceStatus } from "../../types/prismaTypes";

interface AttendanceTableProps {
  attendance: any[];
  handleCheckboxChange: (captainId: number, checkboxType: string) => void;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  attendance,
  handleCheckboxChange,
}) => (
  <table className="simple-table-for-checkboxes">
    <thead>
      <tr>
        <th className="num-col">#</th>
        <th>الاسم</th>
        <th className="check-col">حاضر</th>
        <th className="check-col">معتذر</th>
      </tr>
    </thead>
    <tbody>
      {attendance.map((captain, index) => (
        <tr key={captain.captainId}>
          <td className="num-col">{index + 1}</td>
          <td>{`${captain.firstName} ${captain.middleName} ${captain.lastName}`}</td>
          <td className="check-col">
            <input
              type="checkbox"
              checked={captain?.attendanceStatus === "attended"}
              onChange={() =>
                handleCheckboxChange(captain.captainId, "attended")
              }
              disabled={captain?.attendanceStatus === AttendanceStatus.execused}
            />
          </td>
          <td className="check-col">
            <input
              type="checkbox"
              checked={captain?.attendanceStatus === AttendanceStatus.execused}
              onChange={() =>
                handleCheckboxChange(
                  captain.captainId,
                  AttendanceStatus.execused
                )
              }
              disabled={captain?.attendanceStatus === AttendanceStatus.attended}
            />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
