import { Line } from "react-chartjs-2";
import { useGetSubscriptionLineChartQuery } from "../../redux/slices/stat/stat.money.slice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { ChartData, ChartOptions } from "chart.js/auto";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
);

type SubscriptionLineChartProps = {
  label: string;
};

const SubscriptionLineChart = ({ label }: SubscriptionLineChartProps) => {
  const { data, error, isLoading } = useGetSubscriptionLineChartQuery();

  const mainColor = "75, 192, 192";

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  let gradient = document
    .createElement("canvas")
    .getContext("2d")
    .createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, `rgba(${mainColor},1)`);
  gradient.addColorStop(1, `rgba(${mainColor},0.1)`);

  const chartData: ChartData<"line"> = {
    labels: data?.weeklyData.map((item) => `Week ${item.weekNumber}`),
    datasets: [
      {
        label: label,
        data: data?.weeklyData.map((item) => item.totalSubscription),
        fill: true,
        backgroundColor: gradient,
        borderColor: `rgba(${mainColor},1)`,
        cubicInterpolationMode: "monotone",
        tension: 0.4,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
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
      filler: {},
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line id="subscriptionLineChart" data={chartData} options={options} />;
};

export default SubscriptionLineChart;
