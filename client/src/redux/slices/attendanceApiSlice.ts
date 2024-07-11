import { apiSlice } from "./apiSlice";

const ATTENDANCE_URL = "/api";

export const attendanceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    GetSectorAttendance: builder.query({
      query: (sector) => ({
        url: `${ATTENDANCE_URL}/scoutAttendance/sector/all`,
        method: "GET",
        params: sector,
      }),
      providesTags: ["Attendance"],
    }),
    UpsertSectorAttendance: builder.mutation({
      query: (attendance) => ({
        url: `${ATTENDANCE_URL}/scoutAttendance/`,
        method: "POST",
        body: attendance,
      }),
      invalidatesTags: ["Attendance", "AttendanceRate"],
    }),
    GetUnitAttendance: builder.query({
      query: (unit) => ({
        url: `${ATTENDANCE_URL}/captainAttendance/unit/all`,
        method: "GET",
        params: unit,
      }),
      providesTags: ["Attendance"],
    }),
    UpsertUnitAttendance: builder.mutation({
      query: (attendance) => ({
        url: `${ATTENDANCE_URL}/captainAttendance/`,
        method: "POST",
        body: attendance,
      }),
      invalidatesTags: ["Attendance", "AttendanceRate"],
    }),
  }),
});

export const {
  useGetSectorAttendanceQuery,
  useUpsertSectorAttendanceMutation,
  useGetUnitAttendanceQuery,
  useUpsertUnitAttendanceMutation,
} = attendanceApi;
