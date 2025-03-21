import { apiSlice } from "./apiSlice";

const FINANCE_URL = "/api/finance";

export const financeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    GetBudget: builder.query({
      query: () => ({
        url: `${FINANCE_URL}`,
        method: "GET",
      }),
      providesTags: ["Finance"],
    }),

    InsertSubscription: builder.mutation({
      query: (subscription) => ({
        url: `${FINANCE_URL}/subscription`,
        method: "POST",
        body: subscription,
      }),
      invalidatesTags: ["Finance"],
    }),

    GetIncome: builder.query({
      query: () => ({
        url: `${FINANCE_URL}/income`,
        method: "GET",
      }),
      providesTags: ["Finance"],
    }),

    GetExpense: builder.query({
      query: () => ({
        url: `${FINANCE_URL}/expense`,
        method: "GET",
      }),
      providesTags: ["Finance"],
    }),

    InsertOtherItem: builder.mutation({
      query: (item) => ({
        url: `${FINANCE_URL}/otherItem`,
        method: "POST",
        body: item,
      }),
      invalidatesTags: ["Finance"],
    }),

    GetCurrentWeekSubscriptions: builder.query({
      query: () => ({
        url: `${FINANCE_URL}/subscription/all`,
        method: "GET",
      }),
    }),

    GetSectorSubscription: builder.query<
      {
        message: string;
        body: number;
      },
      {
        sectorBaseName: string;
        sectorSuffixName: string;
        termNumber?: string;
        weekNumber?: string;
      }
    >({
      query: ({
        sectorBaseName,
        sectorSuffixName,
        termNumber,
        weekNumber,
      }) => ({
        url: `${FINANCE_URL}/subscription`,
        method: "GET",
        params: { sectorBaseName, sectorSuffixName, termNumber, weekNumber },
      }),
    }),

    GetAllItems: builder.query({
      query: () => ({
        url: `${FINANCE_URL}/all`,
        method: "GET",
      }),
      providesTags: ["Finance"],
    }),

    deleteItem: builder.mutation({
      query: (itemId) => ({
        url: `${FINANCE_URL}/item`,
        method: "DELETE",
        body: { itemId },
        params: { itemId },
      }),
      invalidatesTags: ["Finance"],
    }),
  }),
});

export const {
  useGetBudgetQuery,
  useInsertSubscriptionMutation,
  useGetIncomeQuery,
  useGetExpenseQuery,
  useInsertOtherItemMutation,
  useGetCurrentWeekSubscriptionsQuery,
  useGetSectorSubscriptionQuery,
  useGetAllItemsQuery,
  useDeleteItemMutation,
} = financeApi;
