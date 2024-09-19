import React from "react";
import { AttendanceStatus } from "../../types/prismaTypes";

interface AttendanceTableProps {
  attendanceType: "captain" | "scout";
  attendance: any[];
  handleCheckboxChange: (id: number, checkboxType: string) => void;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  attendanceType,
  attendance,
  handleCheckboxChange,
}) => {

  return (
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
        {attendance.map((type, index) => (
          <tr
            key={attendanceType === "captain" ? type?.captainId : type.scoutId}
          >
            <td className="num-col">{index + 1}</td>
            <td>{`${type.firstName} ${type.middleName} ${type.lastName}`}</td>
            <td className="check-col">
              <input
                type="checkbox"
                checked={type?.attendanceStatus === "attended"}
                onChange={() =>
                  handleCheckboxChange(
                    attendanceType === "captain"
                      ? type?.captainId
                      : type.scoutId,
                    "attended"
                  )
                }
                disabled={type?.attendanceStatus === AttendanceStatus.execused}
              />
            </td>
            <td className="check-col">
              <input
                type="checkbox"
                checked={type?.attendanceStatus === AttendanceStatus.execused}
                onChange={() =>
                  handleCheckboxChange(
                    attendanceType === "captain"
                      ? type?.captainId
                      : type.scoutId,
                    AttendanceStatus.execused
                  )
                }
                disabled={type?.attendanceStatus === AttendanceStatus.attended}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
