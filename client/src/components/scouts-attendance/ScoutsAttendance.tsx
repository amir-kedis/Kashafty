import { useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

import "./ScoutsAttendance.scss";

import Button from "../common/Button";
import PageTitle from "../common/PageTitle";
import TermWeeksDropdown from "../molecules/TermWeeksDropdown";
import AttendanceInfo from "../molecules/AttendanceInfo";
import Table from "../molecules/Table";
import Subscription from "../molecules/Subscription";

import { useScoutAttendance } from "../../hooks/useScoutsAttendance";
import { useSubscriptipn } from "../../hooks/useSubscription";

type Props = {};

const ScoutsAttendance = (props: Props) => {
  const [chosenWeek, setChosenWeek] = useState("");
  const [termNumber, setTermNumber] = useState("");
  const userInfo: { rSectorBaseName: string; rSectorSuffixName: string } =
    useAuthUser();

  const baseName = userInfo?.rSectorBaseName;
  const suffixName = userInfo?.rSectorSuffixName;

  const {
    attendance,
    setAttendance,
    upsertAttendance,
    isLoadingUpsertAttendance,
    isLoading,
    isError,
  } = useScoutAttendance(chosenWeek, termNumber);

  const {
    subscription,
    setSubscription,
    isLoadingInsertSubscription,
    insertSubsrition,
  } = useSubscriptipn(chosenWeek, termNumber);

  async function handleSubmit(e) {
    e.preventDefault();
    await upsertAttendance();
    await insertSubsrition();
  }

  if (!baseName || !suffixName) {
    return (
      <div className="container">
        <h2>لا يمكنك تسجيل الغياب</h2>
        <p>يرجى تعيين القطاع الخاص بك للقيام بذلك</p>
      </div>
    );
  }

  return (
    <div className="scouts-attendance-page container">
      <PageTitle title="تسجيل الغياب" />
      <form onSubmit={handleSubmit}>
        <TermWeeksDropdown
          setWeek={setChosenWeek}
          setTermNumber={setTermNumber}
          style={{ marginBottom: "2rem" }}
        />
        <Table
          attendanceType="scout"
          attendance={attendance}
          setAttendance={setAttendance}
          isError={isError}
          isLoading={isLoading}
        />
        <AttendanceInfo attendance={attendance} />
        <Subscription
          subscription={subscription}
          setSubscription={setSubscription}
        />
        <Button
          disabled={isLoadingUpsertAttendance || isLoadingInsertSubscription}
          className="Button--medium Button--success-light"
          type="submit"
        >
          تسليم
        </Button>
        {(isLoadingUpsertAttendance || isLoadingInsertSubscription) && (
          <p
            style={{
              textAlign: "center",
              direction: "rtl",
            }}
          >
            جاري التحميل...
          </p>
        )}
      </form>
    </div>
  );
};

export default ScoutsAttendance;
