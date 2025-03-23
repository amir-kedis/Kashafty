import { apiSlice } from "./apiSlice";

const STATS_URL = "/api/stats";

export const statsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    GetAbsenceRate: builder.query({
      query: () => ({
        url: `${STATS_URL}/scouts`,
        method: "GET",
      }),
      providesTags: ["Attendance", "Absence"],
    }),

    GetGraphData: builder.query({
      query: () => ({
        url: `${STATS_URL}/scouts/graph`,
        method: "GET",
      }),
      providesTags: ["Graph", "Attendance", "Absence"],
    }),

    DownloadSectorData: builder.mutation({
      query: (data) => ({
        url: `${STATS_URL}/sector-data`,
        method: "POST",
        body: data,
        responseHandler: (response) => response.blob(),
      }),
    }),

    GetSectorAbsenceRate: builder.query<
      {
        message: string;
        body: number;
      },
      {
        sectorBaseName: string;
        sectorSuffixName: string;
      }
    >({
      query: ({ sectorBaseName, sectorSuffixName }) => ({
        url: `${STATS_URL}/scouts/sector`,
        method: "GET",
        params: { sectorBaseName, sectorSuffixName },
      }),
      providesTags: ["Attendance", "Absence"],
    }),
  }),
});

export const {
  useGetAbsenceRateQuery,
  useGetGraphDataQuery,
  useGetSectorAbsenceRateQuery,
} = statsApi;
