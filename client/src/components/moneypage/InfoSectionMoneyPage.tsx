import React from "react";
import {
  useGetBudgetQuery,
  useGetCurrentWeekSubscriptionsQuery,
  useGetExpenseQuery,
  useGetIncomeQuery,
} from "../../redux/slices/financeApiSlice";
import StatisticTable from "../common/StatisticTable";
import InfoBox from "../common/InfoBox";
import "../../assets/styles/components/MoneyInfoSection.scss";

const InfoSectionMoneyPage: React.FC = () => {
  const ItemsColNames = [
    { name: "#" },
    { name: "الوصف" },
    { name: "القيمة" },
    { name: "النوع" },
  ];

  const { data: budget, isFetching: isFetchingBudget } = useGetBudgetQuery({});
  const { data: income, isFetching: isFetchingIncome } = useGetIncomeQuery({});
  const { data: expense, isFetching: isFetchingExpense } = useGetExpenseQuery(
    {},
  );
  const { data: currentWeekSub, isFetching: isFetchingCurrentWeekSub } =
    useGetCurrentWeekSubscriptionsQuery({});
  if (budget && !isFetchingBudget) console.log("budget = ", budget);
  let AllItems = [{}];

  let TotalIncome = 0;
  if (income && !isFetchingIncome) {
    console.log("income = ", income);
    income.body.map((item) => {
      TotalIncome += item.value;
      AllItems = [
        ...AllItems,
        {
          date: item.timestamp.split("T")[0],
          description: item.description ? item.description : "اشتراك",
          value: item.value,
          type: "دخل",
        },
      ];
    });
    console.log(AllItems);
  }

  let TotalExpense = 0;
  if (expense && !isFetchingExpense) {
    console.log("expense = ", expense);
    expense.body.map((item) => {
      TotalExpense += item.value;
      AllItems = [
        ...AllItems,

        {
          date: item.timestamp.split("T")[0],
          description: item.description,
          value: item.value,
          type: "خصم",
        },
      ];
    });

    console.log(AllItems);
  }

  if (!isFetchingCurrentWeekSub) console.log("sub = ", currentWeekSub);

  return (
    <div className="all-info">
      <section className="info-section">
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
          title="إجمالي الدخل"
          value={isFetchingIncome ? "جاري التحميل" : TotalIncome + " جنيه"}
          color="dark"
        />
        <InfoBox
          title="إجمالي الخصوم"
          value={isFetchingExpense ? "جاري التحميل" : TotalExpense + " جنيه"}
          color="dark"
        />
      </section>

      <section
        style={{
          width: "100%",
          padding: "0",
          margin: "0",
          marginBottom: "2rem",
        }}
        className="table"
      >
        <StatisticTable
          title="البنود"
          columnNames={ItemsColNames}
          dataRows={AllItems}
        />
      </section>
    </div>
  );
};

export default InfoSectionMoneyPage;
