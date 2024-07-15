import { apiSlice } from "../apiSlice";

const STAT_LOGISTICS_URL = "/api/stat/logistics";

export const logisticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTotalScouts: builder.query<
      { message: string; totalScouts: number },
      { sector?: string; unit?: string }
    >({
      query: (query) => ({
        url: `${STAT_LOGISTICS_URL}/scouts`,
        params: query,
      }),
      providesTags: ["Scouts"],
    }),
    getTotalCaptains: builder.query<
      { message: string; totalCaptains: number },
      { sector?: string; unit?: string }
    >({
      query: (query) => ({
        url: `${STAT_LOGISTICS_URL}/captains`,
        params: query,
      }),
      providesTags: ["Captains"],
    }),
    getTotalSectors: builder.query<
      { message: string; totalSectors: number },
      void
    >({
      query: () => ({
        url: `${STAT_LOGISTICS_URL}/sectors`,
      }),
      providesTags: ["Sector"],
    }),
    getScoutGenderDistribution: builder.query<
      { message: string; maleRatio: number; femaleRatio: number },
      void
    >({
      query: () => ({
        url: `${STAT_LOGISTICS_URL}/scout-gender-distribution`,
      }),
      providesTags: ["Scouts"],
    }),
    getCaptainGenderDistribution: builder.query<
      { message: string; maleRatio: number; femaleRatio: number },
      void
    >({
      query: () => ({
        url: `${STAT_LOGISTICS_URL}/captain-gender-distribution`,
      }),
      providesTags: ["Captains"],
    }),
    getSectorCounts: builder.query<
      {
        message: string;
        sectorCounts: {
          sectorName: string;
          scoutCount: number;
        }[];
      },
      void
    >({
      query: () => ({
        url: `${STAT_LOGISTICS_URL}/sector-counts`,
      }),
      providesTags: ["Sector", "Scouts", "Captains"],
    }),
  }),
});

export const {
  useGetTotalScoutsQuery,
  useGetTotalCaptainsQuery,
  useGetTotalSectorsQuery,
  useGetScoutGenderDistributionQuery,
  useGetCaptainGenderDistributionQuery,
  useGetSectorCountsQuery,
} = logisticsApi;
