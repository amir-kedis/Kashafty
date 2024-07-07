import { apiSlice } from "./apiSlice";

const TERM_URL = "/api/term";

export const termApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    GetCurTerm: builder.query({
      query: () => ({
        url: `${TERM_URL}/`,
        method: "GET",
      }),
      providesTags: ["Terms"],
    }),
    GetCurWeek: builder.query({
      query: () => ({
        url: `${TERM_URL}/week`,
        method: "GET",
      }),
      providesTags: ["Weeks"],
    }),
    GetAllWeeks: builder.query({
      query: () => ({
        url: `${TERM_URL}/week/all`,
        method: "GET",
      }),
      providesTags: ["Weeks"],
    }),
    GetRemainingWeeks: builder.query({
      query: () => ({
        url: `${TERM_URL}/remaining`,
        method: "GET",
      }),
      providesTags: ["Weeks"],
    }),
    InsertTerm: builder.mutation({
      query: (term) => ({
        url: `${TERM_URL}/`,
        method: "POST",
        body: term,
      }),
      invalidatesTags: ["Terms", "Weeks"],
    }),
    UpdateTerm: builder.mutation({
      query: (term) => ({
        url: `${TERM_URL}/`,
        method: "PATCH",
        body: term,
      }),
      invalidatesTags: ["Terms", "Weeks"],
    }),
    CancelWeek: builder.mutation({
      query: () => ({
        url: `${TERM_URL}/week`,
        method: "PATCH",
      }),
      invalidatesTags: ["Weeks"],
    }),
  }),
});

export const {
  useGetCurTermQuery,
  useGetCurWeekQuery,
  useGetAllWeeksQuery,
  useGetRemainingWeeksQuery,
  useInsertTermMutation,
  useUpdateTermMutation,
  useCancelWeekMutation,
} = termApi;
