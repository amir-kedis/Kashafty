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
    }),
  }),
});

export const { useSendNotificationMutation } = notificationApi;
