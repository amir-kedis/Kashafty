import {
  useDeleteItemMutation,
  useGetAllItemsQuery,
} from "../redux/slices/financeApiSlice";

const useFinanceItems = () => {
  const { data, error, isLoading } = useGetAllItemsQuery({});

  const [deleteItem, { isLoading: isLoadingDeleteItem }] =
    useDeleteItemMutation();

  const totalIcome = data?.body?.financeItems?.reduce((acc, item) => {
    if (item.type === "income") return acc + item.value;
    return acc;
  }, 0);

  const totalExpense = data?.body?.financeItems?.reduce((acc, item) => {
    if (item.type === "expense") return acc + item.value;
    return acc;
  }, 0);

  return {
    data: data?.body?.financeItems,
    totalIcome,
    totalExpense,
    error,
    isLoading,
    deleteItem,
    isLoadingDeleteItem,
  };
};

export default useFinanceItems;
