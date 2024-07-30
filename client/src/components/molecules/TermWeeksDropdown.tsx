import { useState } from "react";
import { useGetAllWeeksQuery } from "../../redux/slices/termApiSlice";
import CustomSelect from "../common/CustomSelect";

type Props = {
  setWeek: any;
  style: any;
};

const TermWeeksDropdown = ({ setWeek, style }: Props) => {
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
          display: `${week.weekNumber} - ${new Date(week.startDate).toLocaleDateString()}`,
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
          setWeek(e.target.value);
        }}
        required={true}
      />
    </div>
  );
};

export default TermWeeksDropdown;
