import { apiSlice } from "./apiSlice";

const SCOUT_URL = "/api/scout";

export const scoutsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    GetAllScoutsCount: builder.query({
      query: () => ({
        url: `${SCOUT_URL}/`,
        method: "GET",
      }),
      providesTags: ["Scouts"],
    }),
    GetScoutsInUnit: builder.query({
      query: (unitCaptain) => ({
        url: `${SCOUT_URL}/unit/${unitCaptain.captainId}`,
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

    GetScoutById: builder.query({
      query: (id) => ({
        url: `${SCOUT_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Scouts", id }],
    }),

    GetScoutsBySector: builder.query({
      query: (sector) => ({
        url: `${SCOUT_URL}/sector/attendance`,
        method: "GET",
        params: sector,
      }),
      providesTags: ["Scouts", "Attendance"],
    }),

    UpdateScout: builder.mutation({
      query: (scout) => ({
        url: `${SCOUT_URL}/${scout.scoutId}`,
        method: "PUT",
        body: scout,
      }),
      invalidatesTags: ["Scouts"],
    }),

    deleteScout: builder.mutation({
      query: (scoutId) => ({
        url: `${SCOUT_URL}/${scoutId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Scouts"],
    }),
  }),
});

export const {
  useGetAllScoutsCountQuery,
  useGetScoutsInUnitQuery,
  useInsertScoutMutation,
  useGetScoutsInSectorQuery,
  useGetScoutsBySectorQuery, 
  useUpdateScoutMutation,
  useDeleteScoutMutation,
  useGetScoutByIdQuery
} = scoutsApiSlice;
