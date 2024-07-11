import React, { useState } from "react";
import { useGetScoutAttendanceQuery } from "../../redux/slices/stat/stat.attendance.slice";
import TextInput from "../common/Inputs";

type ScoutAttendanceByNameProps = {};

const ScoutAttendanceByName: React.FC<ScoutAttendanceByNameProps> = () => {
  const [searchName, setSearchName] = useState("");
  const { data, error, isLoading } = useGetScoutAttendanceQuery(
    {
      name: searchName,
    },
    { refetchOnMountOrArgChange: true },
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(e.target.value);
  };

  return (
    <div>
      <TextInput
        label="ابحص عن كشاف"
        type="text"
        name="searchName"
        value={searchName}
        onChange={handleInputChange}
        placeholder="اسم الكشاف"
      />
      {isLoading && <p>Loading...</p>}
      {data && (
        <table className="simple-table-for-checkboxes">
          <thead>
            <tr>
              <th className="num-col">#</th>
              <th>الاسم</th>
              <th>معدل الحضور</th>
            </tr>
          </thead>
          <tbody>
            {data.body.map((scout, index) => (
              <tr key={scout.id}>
                <td className="num-col">{index + 1}</td>
                <td>{scout.name}</td>
                <td>{(scout.attendanceRate * 100).toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ScoutAttendanceByName;
