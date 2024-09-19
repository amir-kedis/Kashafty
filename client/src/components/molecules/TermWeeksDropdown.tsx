import { useState } from "react";
import { useGetAllWeeksQuery } from "../../redux/slices/termApiSlice";

import CustomSelect from "../common/CustomSelect";

type Props = {
  setTermNumber: any;
  setWeek: any;
  style: any;
};

const TermWeeksDropdown = ({ setWeek, setTermNumber, style }: Props) => {
  const {
    data: weeks,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  } = useGetAllWeeksQuery({});

  const [chosenWeek, setChosenWeek] = useState("");

  const formattedWeeks =
    isSuccess && !isLoading && !isFetching && !isError
      ? weeks?.body.map((week: any) => ({
          ...week,
          display: `${week.weekNumber} - ${new Date(
            week.startDate
          ).toLocaleDateString()}`,
        }))
      : [];

  return (
    <div style={style}>
      <CustomSelect
        label="تغيير الأسبوع"
        data={formattedWeeks ? formattedWeeks : []}
        displayMember="display"
        valueMember="weekNumber"
        selectedValue={chosenWeek}
        onChange={(e) => {
          setChosenWeek(e.target.value);
          setTermNumber(
            weeks?.body.find(
              (week) => week?.weekNumber === parseInt(e.target.value)
            )?.termNumber
          );
          setWeek(e.target.value);
        }}
        required={true}
      />
      {isLoading && <p style={{ margin: "1rem 0" }}>جاري التحميل...</p>}
    </div>
  );
};

export default TermWeeksDropdown;
