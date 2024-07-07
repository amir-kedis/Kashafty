import { apiSlice } from "./apiSlice";

const ACTIVITIES_URL = "/api/activities";

export const activitiesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllActivities: builder.query({
      query: () => ({
        url: `${ACTIVITIES_URL}/all`,
        method: "GET",
      }),
      providesTags: ["Activities"],
    }),
    insertActivity: builder.mutation({
      query: (activity) => ({
        url: `${ACTIVITIES_URL}`,
        method: "POST",
        body: activity,
      }),
      invalidatesTags: ["Activities"],
    }),
  }),
});

export const { useGetAllActivitiesQuery, useInsertActivityMutation } =
  activitiesApi;
