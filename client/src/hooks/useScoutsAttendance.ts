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
        name: scout.name,
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
    const res = await upsertSectorAttendance({
      attendanceRecords: attendanceReqBody,
    });
    if (res?.status === 200) {
      console.log(res?.data);
      toast.success("تم تسجيل الغياب بنجاح");
    } else {
      console.log(res?.data?.message);
      toast.error("حدث خطأ أثناء تسجيل الغياب");
      toast.error(res?.data?.arabicMessage);
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
