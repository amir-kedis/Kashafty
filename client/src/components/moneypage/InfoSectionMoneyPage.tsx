import React from "react";
import {
  useGetBudgetQuery,
  useGetCurrentWeekSubscriptionsQuery,
  useGetExpenseQuery,
  useGetIncomeQuery,
} from "../../redux/slices/financeApiSlice";
import InfoBox from "../common/InfoBox";
import "../../assets/styles/components/MoneyInfoSection.scss";
import useFinanceItems from "../../hooks/useFinanceItems";
import { Delete } from "@mui/icons-material";

const InfoSectionMoneyPage: React.FC = () => {
  const { data: budget, isFetching: isFetchingBudget } = useGetBudgetQuery({});
  const { data: income, isFetching: isFetchingIncome } = useGetIncomeQuery({});
  const { data: expense, isFetching: isFetchingExpense } = useGetExpenseQuery(
    {},
  );
  const { data: currentWeekSub, isFetching: isFetchingCurrentWeekSub } =
    useGetCurrentWeekSubscriptionsQuery({});
  const {
    totalIcome: TotalIncome,
    totalExpense: TotalExpense,
    data: items,
    deleteItem,
  } = useFinanceItems();

  return (
    <div className="all-info" style={{ width: "100%" }}>
      <section className="info-section" style={{ width: "100%" }}>
        <InfoBox
          title="محتوى الخزنة"
          value={isFetchingBudget ? "جاري التحميل" : budget?.body + " جنيه"}
          color="purple"
        />
        <InfoBox
          title="اشتراك الاسبوع الحالي"
          value={
            isFetchingCurrentWeekSub
              ? "جاري التحميل"
              : currentWeekSub?.body
                ? currentWeekSub?.body + " جنيه"
                : "لا يوجد"
          }
          color="dark"
        />
        <InfoBox
          title="إجمالي الايراد"
          value={isFetchingIncome ? "جاري التحميل" : TotalIncome + " جنيه"}
          color="dark"
        />
        <InfoBox
          title="إجمالي المصروف"
          value={isFetchingExpense ? "جاري التحميل" : TotalExpense + " جنيه"}
          color="dark"
        />
      </section>
      <section style={{ width: "100%", overflowX: "auto" }}>
        <table
          className="simple-table-for-checkboxes"
          style={{ minWidth: "30rem" }}
        >
          <thead>
            <tr>
              <th>التاريخ</th>
              <th>الوقت</th>
              <th>القيمة</th>
              <th>النوع</th>
              <th>الوصف</th>
              <th>لقطاع</th>
              <th>حذف</th>
            </tr>
          </thead>
          <tbody>
            {items &&
              items.map((item) => (
                <tr>
                  <td>
                    {new Date(item.timestamp).toLocaleDateString("ar-EG")}
                  </td>
                  <td>
                    {new Date(item.timestamp).toLocaleTimeString("ar-EG")}
                  </td>
                  <td>{item.value}</td>
                  <td>{item.type === "income" ? "ايراد" : "مصروف"}</td>
                  <td>{item?.description ? item.description : "-"}</td>
                  <td>
                    {item?.sectorBaseName
                      ? item.sectorBaseName + " " + item.sectorSuffixName
                      : "-"}
                  </td>
                  <td>
                    <button
                      onClick={() => deleteItem(item.itemId)}
                      style={{
                        backgroundColor: "transparent",
                        color: "red",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <Delete />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default InfoSectionMoneyPage;
