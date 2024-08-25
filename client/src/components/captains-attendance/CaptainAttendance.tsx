import { useEffect, useState } from "react";
import CustomSelect from "../common/CustomSelect";
import PageTitle from "../common/PageTitle";
import "../scouts-attendance/ScoutsAttendance.scss";
import InfoBox from "../common/InfoBox";
import Button from "../common/Button";
import { useGetAllWeeksQuery } from "../../redux/slices/termApiSlice";
import { toast } from "react-toastify";
import {
  useGetUnitAttendanceQuery,
  useUpsertUnitAttendanceMutation,
} from "../../redux/slices/attendanceApiSlice";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

export default function CaptainsAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [chosenWeek, setChosenWeek] = useState("");

  let {
    data: weeks,
    isLoading: isLoadingWeeks,
    isFetching: isFetchingWeeks,
    isSuccess: isSuccessWeeks,
  } = useGetAllWeeksQuery({});

  const userInfo = useAuthUser();

  const [upsertAttendance, { isLoading: isLoadingUpsertAttendance }] =
    useUpsertUnitAttendanceMutation();

  if (isSuccessWeeks && !isLoadingWeeks && !isFetchingWeeks) {
    weeks = weeks?.body;
    weeks = weeks.map((week) => ({
      ...week,
      display:
        week?.weekNumber +
        " - " +
        new Date(week?.startDate).toLocaleDateString(),
    }));

    // console.log(weeks);
  }

  let {
    data: scouts,
    isLoading: isLoadingScouts,
    isFetching: isFetchingScouts,
    isSuccess: isSuccessScouts,
    refetch: refetchScouts,
    isError: isErrorScouts,
    error: errorScouts,
  } = useGetUnitAttendanceQuery({
    unitCaptainId: userInfo?.captainId,
    weekNumber: parseInt(chosenWeek),
    termNumber: weeks?.find((week) => week.weekNumber === parseInt(chosenWeek))
      ?.termNumber,
  });

  if (isErrorScouts) {
    console.log({ errorScouts });
    console.log({
      unitCaptainId: userInfo.captainId,
      weekNumber: parseInt(chosenWeek),
      termNumber: weeks?.find(
        (week) => week.weekNumber === parseInt(chosenWeek),
      )?.termNumber,
    });
  }

  if (isSuccessScouts && !isLoadingScouts && !isFetchingScouts) {
    scouts = scouts?.body;
    scouts = scouts.map((scout) => ({
      ...scout,
      present: scout?.attendanceStatus === "attended",
      excused: scout?.attendanceStatus === "execused",
      id: scout.scoutId,
      name: scout.firstName + " " + scout.middleName + " " + scout.lastName,
    }));
    console.log({ captains: scouts });
  }

  useEffect(() => {
    if (isSuccessScouts && !isLoadingScouts && !isFetchingScouts && scouts) {
      setAttendance(scouts);
    }
  }, [isSuccessScouts, isLoadingScouts, isFetchingScouts, chosenWeek]);

  const handleCheckboxChange = (scoutId, checkboxType) => {
    setAttendance((prevState) => {
      return prevState.map((scout) => {
        return scoutId === scout.captainId
          ? { ...scout, [checkboxType]: !scout[checkboxType] }
          : scout;
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const attendanceReqBody = attendance.map((scout) => ({
      ...scout,
      attendanceStatus: scout.present
        ? "attended"
        : scout.excused
          ? "execused"
          : "absent",
      weekNumber: parseInt(chosenWeek),
      termNumber: weeks.find((week) => week.weekNumber === parseInt(chosenWeek))
        ?.termNumber,
      sectorBaseName: userInfo?.rSectorBaseName,
      sectorSuffixName: userInfo?.rSectorSuffixName,
    }));

    console.log({ attendanceReqBody });

    try {
      const res = await upsertAttendance({
        attendanceRecords: attendanceReqBody,
      }).unwrap();
      if (res.status === 400 || res.status === 500)
        throw new Error("Something went wrong while inserting attendance");
      toast.success("تم تسجيل الغياب بنجاح");
      console.log(res?.body);
    } catch (err) {
      toast.error("حدث خطأ أثناء تسجيل الغياب");
      console.log(JSON.stringify(err));
      toast.error(JSON.stringify(err));
    }
  };

  // if (!userInfo?.rSectorBaseName || !userInfo?.rSectorSuffixName) {
  //   return (
  //     <div className="container">
  //       <h2>لا يمكنك تسجيل الغياب</h2>
  //       <p>يرجى تعيين القطاع الخاص بك للقيام بذلك</p>
  //     </div>
  //   );
  // }

  return (
    <form onSubmit={handleSubmit} className="scouts-attendance-page container">
      <PageTitle title="تسجيل الغياب" />

      <div className="choose-week">
        <CustomSelect
          label="تغيير الأسبوع"
          data={weeks ? weeks : []}
          displayMember="display"
          valueMember="weekNumber"
          selectedValue={chosenWeek}
          onChange={(e) => {
            setChosenWeek(e.target.value);
            refetchScouts();
          }}
          required={true}
        />
        {isLoadingWeeks && <p>جاري التحميل...</p>}
      </div>

      <div className="record-attendance">
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
            {attendance.map((scout, index) => (
              <tr key={scout.captainId}>
                <td className="num-col">{index + 1}</td>
                <td>{scout.name}</td>
                <td className="check-col">
                  <input
                    type="checkbox"
                    checked={scout?.present}
                    onChange={() =>
                      handleCheckboxChange(scout.captainId, "present")
                    }
                    disabled={scout?.excused}
                  />
                </td>
                <td className="check-col">
                  <input
                    type="checkbox"
                    checked={scout?.excused}
                    onChange={() =>
                      handleCheckboxChange(scout.captainId, "excused")
                    }
                    disabled={scout?.present}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isFetchingScouts && <p>جاري التحميل</p>}
        <div className="info-section attendance-info-section">
          <InfoBox title="العدد الكلي" value={attendance.length} />
          <InfoBox
            title="الحضور"
            value={attendance.filter((scout) => scout.present).length}
          />
          <InfoBox
            title="نسبة الحضور"
            value={
              attendance.length > 0
                ? Math.round(
                    (attendance.filter((scout) => scout.present).length /
                      attendance.length) *
                      100,
                  ) + "%"
                : "0%"
            }
          />
          <InfoBox
            title="الغياب"
            value={attendance.filter((scout) => !scout.present).length}
          />
        </div>
      </div>

      <Button className="Button--medium Button--success-light" type="submit">
        تسليم
      </Button>
      {isLoadingUpsertAttendance && (
        <p
          style={{
            direction: "rtl",
          }}
        >
          جاري التحميل
        </p>
      )}
    </form>
  );
}
