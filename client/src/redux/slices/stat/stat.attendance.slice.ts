import { apiSlice } from "../apiSlice";

const STAT_ATTENDANCE_URL = "/api/stat/attendance";

export const activitiesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAttendaceRate: builder.query<
      { message: string; body: number },
      {
        sectorBaseName?: string;
        sectorSuffixName?: string;
        unitCaptainId?: number;
      }
    >({
      query: (query) => ({
        url: `${STAT_ATTENDANCE_URL}/rate`,
        params: query,
      }),
      providesTags: ["AttendanceRate"],
    }),
    getAttendaceLineChart: builder.query<
      {
        message: string;
        body: {
          weekNumber: number;
          absenceRate: number;
        }[];
      },
      {
        sectorBaseName?: string;
        sectorSuffixName?: string;
        unitCaptainId?: number;
      }
    >({
      query: (query) => ({
        url: `${STAT_ATTENDANCE_URL}/line-chart`,
        params: query,
      }),
      providesTags: ["AttendanceRate"],
    }),

    getAttendanceStackedChart: builder.query<
      {
        message: string;
        body: {
          sectorBaseName: string;
          sectorSuffixName: string;
          attendanceRates: {
            weekNumber: number;
            absenceRate: number;
          }[];
        }[];
      },
      void
    >({
      query: () => ({
        url: `${STAT_ATTENDANCE_URL}/stacked-line-chart`,
      }),
      providesTags: ["AttendanceRate"],
    }),

    getScoutAttendance: builder.query<
      {
        message: string;
        body: {
          id: number;
          name: string;
          attendanceRate: number;
        }[];
      },
      {
        name: string;
      }
    >({
      query: (query) => ({
        url: `${STAT_ATTENDANCE_URL}/scout`,
        params: query,
      }),
      providesTags: ["AttendanceRate"],
    }),
  }),
});

export const {
  useGetAttendaceRateQuery,
  useGetAttendaceLineChartQuery,
  useGetAttendanceStackedChartQuery,
  useGetScoutAttendanceQuery,
} = activitiesApi;
