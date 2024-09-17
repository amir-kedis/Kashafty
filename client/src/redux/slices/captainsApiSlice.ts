import { apiSlice } from "./apiSlice";

const CAPTAINS_URL = "/api/captain";

export const captainsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    GetCaptains: builder.query({
      query: () => ({
        url: `${CAPTAINS_URL}/`,
        method: "GET",
      }),
      providesTags: ["Captains"],
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
  useGetCaptainsInUnitQuery,
  useGetUnitCaptainsQuery,
  useUpdateCaptainTypeMutation,
} = captainsApi;
