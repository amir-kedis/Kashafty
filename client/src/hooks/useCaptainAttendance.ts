import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

import {
  useGetUnitAttendanceQuery,
  useUpsertUnitAttendanceMutation,
} from "../redux/slices/attendanceApiSlice";

export const useCaptainAttendance = (chosenWeek, termNumber) => {
  const [attendance, setAttendance] = useState([]);
  const user: { captainId: number } = useAuthUser();

  const {
    data: captains,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetUnitAttendanceQuery(
    {
      unitCaptainId: user.captainId,
      weekNumber: parseInt(chosenWeek),
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !chosenWeek,
    }
  );

  const [upsertUnitAttendance, { isLoading: isLoadingUpsertAttendance }] =
    useUpsertUnitAttendanceMutation();

  useEffect(() => {
    if (isSuccess && !isLoading && !isFetching && captains) {
      const formattedCaptains = captains.map((captain) => ({
        ...captain,
        present: captain?.attendanceStatus === "attended",
        excused: captain?.attendanceStatus === "execused",
        id: captain.captainId,
        name: `${captain.firstName} ${captain.middleName} ${captain.lastName}`,
      }));
      setAttendance(formattedCaptains);
    }
  }, [isSuccess, isLoading, isFetching, chosenWeek, captains]);

  async function upsertAttendance() {
    const attendanceReqBody = attendance.map((captain) => ({
      ...captain,
      attendanceStatus: captain?.attendanceStatus ?? "absent",
      weekNumber: parseInt(chosenWeek),
      termNumber,
    }));

    console.log(attendanceReqBody);
    try {
      const res = await upsertUnitAttendance({
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
