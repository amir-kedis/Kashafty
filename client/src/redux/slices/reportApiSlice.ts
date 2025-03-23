import { apiSlice } from "./apiSlice";

const STATS_URL = "/api/report";

export const reportApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    DownloadSectorData: builder.mutation({
      query: (data) => ({
        url: `${STATS_URL}/sector-data`,
        method: "POST",
        body: data,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const { useDownloadSectorDataMutation } = reportApiSlice;