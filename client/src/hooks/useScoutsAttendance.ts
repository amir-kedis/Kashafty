import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

import {
  useGetSectorAttendanceQuery,
  useUpsertSectorAttendanceMutation,
} from "../redux/slices/attendanceApiSlice";

export const useScoutAttendance = (chosenWeek, termNumber) => {
  const [attendance, setAttendance] = useState([]);
  const userInfo: { rSectorBaseName: string; rSectorSuffixName: string } =
    useAuthUser();
  const baseName = userInfo?.rSectorBaseName;
  const suffixName = userInfo?.rSectorSuffixName;

  let {
    data: scouts,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetSectorAttendanceQuery(
    {
      weekNumber: parseInt(chosenWeek),
      termNumber,
      baseName,
      suffixName,
    },
    { refetchOnMountOrArgChange: true, skip: !chosenWeek }
  );

  const [upsertSectorAttendance, { isLoading: isLoadingUpsertAttendance }] =
    useUpsertSectorAttendanceMutation();

  useEffect(() => {
    if (isSuccess && !isLoading && !isFetching && scouts) {
      scouts = scouts?.body;
      const formattedScouts = scouts.map((scout) => ({
        ...scout,
        present: scout?.attendanceStatus === "attended",
        excused: scout?.attendanceStatus === "execused",
        id: scout.scoutId,
        name: `${scout.firstName} ${scout.middleName} ${scout.lastName}`,
      }));
      setAttendance(formattedScouts);
    }
  }, [isSuccess, isLoading, isFetching, chosenWeek, scouts]);

  async function upsertAttendance() {
    const attendanceReqBody = attendance.map((scout) => ({
      ...scout,
      attendanceStatus: scout?.attendanceStatus ?? "absent",
      weekNumber: parseInt(chosenWeek),
      termNumber,
      sectorBaseName: baseName,
      sectorSuffixName: suffixName,
    }));

    console.log(attendanceReqBody);
    try {
      const res = await upsertSectorAttendance({
        attendanceRecords: attendanceReqBody,
      });
      console.log(res?.data);
      toast.success("تم تسجيل الغياب بنجاح");
    } catch (err) {
      console.log(err?.data?.message);
      toast.error("حدث خطأ أثناء تسجيل الغياب");
      toast.error(err?.data?.arabicMessage);
    }
  }

  return {
    attendance,
    setAttendance,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
    upsertAttendance,
    isLoadingUpsertAttendance,
  };
};
