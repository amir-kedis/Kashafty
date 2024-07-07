import { apiSlice } from "./apiSlice";

const SCOUT_URL = "/api/scout";

export const scoutsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    GetAllScoutsCount: builder.query({
      query: () => ({
        url: `${SCOUT_URL}/`,
        method: "GET",
      }),
      providesTags: ["Scouts"],
    }),
    InsertScout: builder.mutation({
      query: (scout) => ({
        url: `${SCOUT_URL}/`,
        method: "POST",
        body: scout,
      }),
      invalidatesTags: ["Scouts"],
    }),
    GetScoutsInSector: builder.query({
      query: (sector) => ({
        url: `${SCOUT_URL}/sector/all`,
        method: "GET",
        params: sector,
      }),
      providesTags: ["Scouts"],
    }),

    UpdateScout: builder.mutation({
      query: (scout) => ({
        url: `${SCOUT_URL}/${scout.scoutId}`,
        method: "PUT",
        body: scout,
      }),
      invalidatesTags: ["Scouts"],
    }),
  }),
});

export const {
  useGetAllScoutsCountQuery,
  useInsertScoutMutation,
  useGetScoutsInSectorQuery,
  useUpdateScoutMutation,
} = scoutsApi;
