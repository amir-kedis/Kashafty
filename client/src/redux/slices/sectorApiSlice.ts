import { apiSlice } from "./apiSlice";

const SECTOR_URL = "/api/sector";

export const sectorApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    GetSectors: builder.query({
      query: () => ({
        url: `${SECTOR_URL}/all`,
        method: "GET",
      }),
      providesTags: ["Sector"],
    }),
    InsertSector: builder.mutation({
      query: (sector) => ({
        url: `${SECTOR_URL}/`,
        method: "POST",
        body: sector,
      }),
      invalidatesTags: ["Sector", "Captains"],
    }),
    UpdateSectorUnitCaptain: builder.mutation({
      query: (sector) => ({
        url: `${SECTOR_URL}/unit`,
        method: "PATCH",
        body: sector,
        params: sector,
      }),
      invalidatesTags: ["Sector"],
    }),
    UpdateSectorRegularCaptain: builder.mutation({
      query: (sector) => ({
        url: `${SECTOR_URL}/captain/assign`,
        method: "PATCH",
        body: sector,
        params: sector,
      }),
      invalidatesTags: ["Sector"],
    }),
  }),
});

export const {
  useGetSectorsQuery,
  useInsertSectorMutation,
  useUpdateSectorUnitCaptainMutation,
  useUpdateSectorRegularCaptainMutation,
} = sectorApiSlice;
