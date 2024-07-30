import { useState } from "react";

import "./CaptainAttendancePage.scss";

import PageTitle from "../components/common/PageTitle";
import TermWeeksDropdown from "../components/molecules/TermWeeksDropdown";
import UnitCaptainsTable from "../components/molecules/UnitCaptainsTable";
import { useCaptainAttendance } from "../hooks/useCaptainAttendance";

type Props = {};

const CaptainAttendancePage = (props: Props) => {
  const [chosenWeek, setChosenWeek] = useState("");
  const { attendance, setAttendance, upsertAttendance, isLoading, isError } =
    useCaptainAttendance(chosenWeek);

  return (
    <div className="captain-attendance-page container">
      <PageTitle title="تسجيل غياب القادة" />
      <form>
        <TermWeeksDropdown
          setWeek={setChosenWeek}
          style={{ marginBottom: "2rem" }}
        />
        <UnitCaptainsTable
          attendance={attendance}
          setAttendance={setAttendance}
          isError={isError}
          isLoading={isLoading}
        />
      </form>
    </div>
  );
};

export default CaptainAttendancePage;
