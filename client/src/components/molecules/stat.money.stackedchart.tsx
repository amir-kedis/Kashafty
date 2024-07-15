import { Bar } from "react-chartjs-2";
import { useGetIncomeExpenseStackedChartQuery } from "../../redux/slices/stat/stat.money.slice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ChartData, ChartOptions } from "chart.js/auto";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

type IncomeExpenseStackedChartProps = {
  label: string;
};

const IncomeExpenseStackedChart = ({
  label,
}: IncomeExpenseStackedChartProps) => {
  const { data, error, isLoading } = useGetIncomeExpenseStackedChartQuery();

  const incomeColor = "183,115,233";
  const expenseColor = "255,99,132";

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  const chartData: ChartData<"bar"> = {
    labels: data?.weeklyData.map((item) => `Week ${item.weekNumber}`),
    datasets: [
      {
        label: "دخل",
        data: data?.weeklyData.map((item) => item.totalIncome),
        backgroundColor: `rgba(${incomeColor},0.9)`,
        borderColor: `rgba(${incomeColor},1)`,
        borderWidth: 1,
      },
      {
        label: "خصم",
        data: data?.weeklyData.map((item) => item.totalExpense),
        backgroundColor: `rgba(${expenseColor},0.9)`,
        borderColor: `rgba(${expenseColor},1)`,
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: false,
        text: label,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
  };

  return (
    <Bar id="incomeExpenseStackedChart" data={chartData} options={options} />
  );
};

export default IncomeExpenseStackedChart;
