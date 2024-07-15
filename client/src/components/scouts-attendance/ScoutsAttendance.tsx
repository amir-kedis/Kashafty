import { useEffect, useState } from "react";
import CustomSelect from "../common/CustomSelect";
import PageTitle from "../common/PageTitle";
import "./ScoutsAttendance.scss";
import InfoBox from "../common/InfoBox";
import TextInput from "../common/Inputs";
import Button from "../common/Button";
import { useGetAllWeeksQuery } from "../../redux/slices/termApiSlice";
import { useSelector } from "react-redux";
import {
  useInsertSubscriptionMutation,
  useGetSectorSubscriptionQuery,
} from "../../redux/slices/financeApiSlice";
import { toast } from "react-toastify";
import {
  useGetSectorAttendanceQuery,
  useUpsertSectorAttendanceMutation,
} from "../../redux/slices/attendanceApiSlice";
import { RootState } from "../../redux/store";

export default function ScoutsAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [subscription, setSubscription] = useState<number>(0);
  const [chosenWeek, setChosenWeek] = useState("");

  let {
    data: weeks,
    isLoading: isLoadingWeeks,
    isFetching: isFetchingWeeks,
    isSuccess: isSuccessWeeks,
  } = useGetAllWeeksQuery({});

  const { userInfo } = useSelector((state: RootState) => state.auth);

  const [insertSubscription, { isLoading: isLoadingInsertSubscription }] =
    useInsertSubscriptionMutation();
  const [upsertAttendance, { isLoading: isLoadingUpsertAttendance }] =
    useUpsertSectorAttendanceMutation();

  if (isSuccessWeeks && !isLoadingWeeks && !isFetchingWeeks) {
    weeks = weeks?.body;
    weeks = weeks.map((week) => ({
      ...week,
      display:
        week?.weekNumber +
        " - " +
        new Date(week?.startDate).toLocaleDateString(),
    }));
  }

  let {
    data: scouts,
    isLoading: isLoadingScouts,
    isFetching: isFetchingScouts,
    isSuccess: isSuccessScouts,
    refetch: refetchScouts,
  } = useGetSectorAttendanceQuery({
    weekNumber: parseInt(chosenWeek),
    termNumber: weeks?.find((week) => week.weekNumber === parseInt(chosenWeek))
      ?.termNumber,
    baseName: userInfo?.rSectorBaseName,
    suffixName: userInfo?.rSectorSuffixName,
  });

  let { data, isSuccess, isError } = useGetSectorSubscriptionQuery(
    {
      weekNumber: chosenWeek,
      sectorBaseName: userInfo?.rSectorBaseName,
      sectorSuffixName: userInfo?.rSectorSuffixName,
    },
    { refetchOnMountOrArgChange: true, skip: !chosenWeek },
  );

  if (isSuccessScouts && !isLoadingScouts && !isFetchingScouts) {
    scouts = scouts?.body;
    scouts = scouts.map((scout) => ({
      ...scout,
      present: scout?.attendanceStatus === "attended",
      excused: scout?.attendanceStatus === "execused",
      id: scout.scoutId,
      name: scout.firstName + " " + scout.middleName + " " + scout.lastName,
    }));
  }

  useEffect(() => {
    if (isSuccessScouts && !isLoadingScouts && !isFetchingScouts && scouts) {
      setAttendance(scouts);
    }
  }, [isSuccessScouts, isLoadingScouts, isFetchingScouts, chosenWeek]);

  useEffect(() => {
    if (isSuccess && !isError && data?.body) setSubscription(data?.body);
    else setSubscription(0);
  }, [data, isSuccess]);

  const handleCheckboxChange = (scoutId, checkboxType) => {
    setAttendance((prevState) => {
      return prevState.map((scout) => {
        return scoutId === scout.id
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

    const subscriptionReqBody = {
      value: subscription,
      weekNumber: parseInt(chosenWeek),
      termNumber: weeks.find((week) => week.weekNumber === parseInt(chosenWeek))
        ?.termNumber,
      sectorBaseName: userInfo?.rSectorBaseName,
      sectorSuffixName: userInfo?.rSectorSuffixName,
    };

    console.log({ subscriptionReqBody });

    try {
      const res = await insertSubscription(subscriptionReqBody).unwrap();
      if (res.status === 400 || res.status === 500)
        throw new Error(
          "Something went wrong while inserting the subscription",
        );
      toast.success("تم تسجيل الاشتراك بنجاح");
    } catch (err) {
      toast.error("حدث خطأ أثناء تسجيل الاشتراك");
      console.log(JSON.stringify(err));
      toast.error(JSON.stringify(err));
    }
    try {
      const res = await upsertAttendance({
        attendanceRecords: attendanceReqBody,
      }).unwrap();
      // if (!res.ok)
      // throw new Error("Something went wrong while inserting attendance");
      toast.success("تم تسجيل الغياب بنجاح");
      console.log(res.body);
    } catch (err) {
      toast.error("حدث خطأ أثناء تسجيل الغياب");
      console.log(JSON.stringify(err));
      toast.error(JSON.stringify(err));
    }
  };

  if (!userInfo?.rSectorBaseName || !userInfo?.rSectorSuffixName) {
    return (
      <div className="container">
        <h2>لا يمكنك تسجيل الغياب</h2>
        <p>يرجى تعيين القطاع الخاص بك للقيام بذلك</p>
      </div>
    );
  }

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
            {attendance &&
              chosenWeek != "" &&
              !isFetchingWeeks &&
              !isFetchingScouts &&
              attendance?.map((scout, index) => (
                <tr key={scout.id}>
                  <td className="num-col">{index + 1}</td>
                  <td>{scout.name}</td>
                  <td className="check-col">
                    <input
                      type="checkbox"
                      checked={scout?.present}
                      onChange={() => handleCheckboxChange(scout.id, "present")}
                      disabled={scout?.excused}
                    />
                  </td>
                  <td className="check-col">
                    <input
                      type="checkbox"
                      checked={scout?.excused}
                      onChange={() => handleCheckboxChange(scout.id, "excused")}
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
            value={
              attendance &&
              !isFetchingWeeks &&
              !isFetchingScouts &&
              attendance?.filter((scout) => scout.present)?.length
            }
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
      <div className="subscription-box">
        <div className="info-box colorful">
          <h4>تسجيل الاشتراك</h4>
          <TextInput
            name="subscription"
            label=""
            type="number"
            placeholder="المبلغ المدفوع"
            value={subscription.toString()}
            onChange={(e) => setSubscription(parseInt(e.target.value))}
            required={true}
          />
          <p>يرجى ادخال إجمالي الاشتراك الفعلي</p>
        </div>
      </div>
      <Button className="Button--medium Button--success-light" type="submit">
        تسليم
      </Button>
      {(isLoadingInsertSubscription || isLoadingUpsertAttendance) && (
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
