import { apiSlice } from "./apiSlice";

const CAPTAINS_URL = "/api/captain";

export const captainsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    GetCaptains: builder.query({
      query: () => ({
        url: `${CAPTAINS_URL}/`,
        method: "GET",
      }),
      providesTags: ["Captains"],
    }),
    GetCaptainsBySector: builder.query({
      query: (sector) => ({
        url: `${CAPTAINS_URL}/sector`,
        method: "GET",
        params: sector,
      }),
      providesTags: ["Captains", "Absence"],
    }),
    GetCaptainsInUnit: builder.query({
      query: (unitCaptain) => ({
        url: `${CAPTAINS_URL}/unit/${unitCaptain.captainId}`,
        method: "GET",
      }),
      providesTags: ["Captains"],
    }),
    GetUnitCaptains: builder.query({
      query: () => ({
        url: `${CAPTAINS_URL}/`,
        method: "GET",
      }),
      providesTags: ["Captains"],
    }),
    UpdateCaptainType: builder.mutation({
      query: (captain) => ({
        url: `${CAPTAINS_URL}/${captain.captainId}`,
        method: "PATCH",
        body: captain,
      }),
      invalidatesTags: ["Captains"],
    }),
  }),
});

export const {
  useGetCaptainsQuery,
  useGetCaptainsBySectorQuery, 
  useGetCaptainsInUnitQuery,
  useGetUnitCaptainsQuery,
  useUpdateCaptainTypeMutation,
} = captainsApiSlice;
