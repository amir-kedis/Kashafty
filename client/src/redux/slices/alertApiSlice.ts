import { apiSlice } from "./apiSlice";

const ALERT_URL = "/api/alert";

export const alertApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllAlerts: builder.query({
      query: (params) => ({
        url: `${ALERT_URL}/all`,
        method: "GET",
        params,
      }),
      providesTags: ["Alert"],
    }),
    getAlert: builder.query({
      query: (id) => ({
        url: `${ALERT_URL}/${id}`,
        method: "GET",
      }),
      providesTags: ["Alert"],
    }),
    sendAlert: builder.mutation({
      query: ({ id, item }) => ({
        url: `${ALERT_URL}/${id}`,
        method: "POST",
        body: item,
      }),
      invalidatesTags: ["Alert"],
    }),
    createAlert: builder.mutation({
      query: (alert) => ({
        url: `${ALERT_URL}`,
        method: "POST",
        body: alert,
      }),
      invalidatesTags: ["Alert"],
    }),
    updateStatus: builder.mutation({
      query: (id) => ({
        url: `${ALERT_URL}/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Alert"],
    }),
    deleteAlert: builder.mutation({
      query: (id) => ({
        url: `${ALERT_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Alert"],
    }),
  }),
});

export const {
  useGetAllAlertsQuery,
  useGetAlertQuery,
  useSendAlertMutation,
  useCreateAlertMutation,
  useUpdateStatusMutation,
  useDeleteAlertMutation,
} = alertApi;
