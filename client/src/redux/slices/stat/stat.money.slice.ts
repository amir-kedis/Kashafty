import { apiSlice } from "../apiSlice";

const STAT_MONEY_URL = "/api/stat/money";

export const moneyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTotalMoney: builder.query<{ message: string; totalMoney: number }, void>(
      {
        query: () => ({
          url: `${STAT_MONEY_URL}/total`,
        }),
        providesTags: ["Money"],
      },
    ),
    getTotalIncome: builder.query<
      { message: string; totalMoney: number },
      void
    >({
      query: () => ({
        url: `${STAT_MONEY_URL}/income`,
      }),
      providesTags: ["Money"],
    }),
    getTotalExpense: builder.query<
      { message: string; totalMoney: number },
      void
    >({
      query: () => ({
        url: `${STAT_MONEY_URL}/spent`,
      }),
      providesTags: ["Money"],
    }),
    getCurrentWeekSubscription: builder.query<
      { message: string; totalMoney: number },
      void
    >({
      query: () => ({
        url: `${STAT_MONEY_URL}/current-week-subscription`,
      }),
      providesTags: ["Money"],
    }),
    getMoneyLineChart: builder.query<
      {
        message: string;
        weeklyTotals: { weekNumber: number; totalMoney: number }[];
      },
      void
    >({
      query: () => ({
        url: `${STAT_MONEY_URL}/line-chart`,
      }),
      providesTags: ["Money"],
    }),
    getIncomeExpenseStackedChart: builder.query<
      {
        message: string;
        weeklyData: {
          weekNumber: number;
          totalIncome: number;
          totalExpense: number;
        }[];
      },
      void
    >({
      query: () => ({
        url: `${STAT_MONEY_URL}/income-expense-chart`,
      }),
      providesTags: ["Money"],
    }),
    getSubscriptionLineChart: builder.query<
      {
        message: string;
        weeklyData: {
          weekNumber: number;
          totalSubscription: number;
        }[];
      },
      void
    >({
      query: () => ({
        url: `${STAT_MONEY_URL}/subscription-line-chart`,
      }),
      providesTags: ["Money"],
    }),
  }),
});

export const {
  useGetTotalMoneyQuery,
  useGetTotalIncomeQuery,
  useGetTotalExpenseQuery,
  useGetCurrentWeekSubscriptionQuery,
  useGetMoneyLineChartQuery,
  useGetIncomeExpenseStackedChartQuery,
  useGetSubscriptionLineChartQuery,
} = moneyApi;
