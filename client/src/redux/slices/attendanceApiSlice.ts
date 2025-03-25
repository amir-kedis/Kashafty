import { apiSlice } from "./apiSlice";

interface Captain {
  captainId: number;
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  rSectorBaseName: string;
  rSectorSuffixName: string;
  gender: "male" | "female";
  type: "general" | "unit" | "regular";
  attendanceStatus: "attended" | "execused" | "absent" | null;
}

interface GetUnitAttendanceResponse {
  message: string;
  body: Captain[];
  count: number;
}

interface GetUnitAttendanceArgs {
  unitCaptainId: number;
  weekNumber: number;
  termNumber?: number;
}

interface UpsertUnitAttendanceArgs {
  attendanceRecords: {
    captainId: number;
    weekNumber: number;
    termNumber: number;
    attendanceStatus: "attended" | "execused" | "absent";
  }[];
}

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

    getUnitAttendance: builder.query<Captain[], GetUnitAttendanceArgs>({
      query: (args) => ({
        url: `${ATTENDANCE_URL}/captainAttendance/unit/all`,
        method: "GET",
        params: args,
      }),
      transformResponse: (response: GetUnitAttendanceResponse) => response.body,
      providesTags: ["Attendance"],
    }),
    upsertUnitAttendance: builder.mutation<void, UpsertUnitAttendanceArgs>({
      query: (attendance) => ({
        url: `${ATTENDANCE_URL}/captainAttendance/`,
        method: "POST",
        body: attendance,
      }),
      invalidatesTags: ["Attendance", "AttendanceRate"],
    }),

    GetScoutAttendanceHistory: builder.query({
      query: (scoutId) => ({
        url: `${ATTENDANCE_URL}/scoutAttendance/scout/${scoutId}/history`,
        method: "GET",
      }),
      providesTags: (result, error, scoutId) => [
        { type: "Attendance", id: scoutId },
      ],
    }),
    GetScoutAttendanceStats: builder.query({
      query: (scoutId) => ({
        url: `${ATTENDANCE_URL}/scoutAttendance/scout/${scoutId}/stats`,
        method: "GET",
      }),
      providesTags: (result, error, scoutId) => [
        { type: "Attendance", id: scoutId },
      ],
    }),
  }),
});

export const {
  useGetSectorAttendanceQuery,
  useUpsertSectorAttendanceMutation,
  useGetUnitAttendanceQuery,
  useUpsertUnitAttendanceMutation,
  useGetScoutAttendanceHistoryQuery,
  useGetScoutAttendanceStatsQuery
} = attendanceApi;
