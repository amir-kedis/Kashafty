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
  }),
});

export const { useGetAbsenceRateQuery, useGetGraphDataQuery } = statsApi;
