import { Notification } from "../../types/prismaTypes";
import { apiSlice } from "./apiSlice";

const NOTIFICATION_URL = "/api/notification";

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendNotification: builder.mutation<
      { message: string },
      {
        type: string;
        title: string;
        message: string;
        sectorBaseName?: string;
        sectorSuffixName?: string;
      }
    >({
      query: (body) => ({
        url: NOTIFICATION_URL,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Notifications"],
    }),

    getNotifications: builder.query<
      { message: string; body: Notification[] },
      {
        captainId: number;
        type?: string;
        status?: string;
      }
    >({
      query: (query) => ({
        url: NOTIFICATION_URL,
        params: query,
      }),
      providesTags: ["Notifications"],
    }),

    updateNotification: builder.mutation<
      { message: string; body: Notification },
      {
        id: number;
        status: string;
      }
    >({
      query: (body) => ({
        url: NOTIFICATION_URL,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Notifications"],
    }),

    deleteNotification: builder.mutation<
      { message: string },
      {
        id: number;
      }
    >({
      query: (body) => ({
        url: NOTIFICATION_URL,
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useSendNotificationMutation,
  useGetNotificationsQuery,
  useUpdateNotificationMutation,
  useDeleteNotificationMutation,
} = notificationApi;
