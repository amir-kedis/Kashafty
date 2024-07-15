import { Line } from "react-chartjs-2";
import { useGetAttendaceLineChartQuery } from "../../redux/slices/stat/stat.attendance.slice";
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

type AttendanceLineChartProps = {
  label: string;
  sectorBaseName?: string;
  sectorSuffixName?: string;
  unitCaptainId?: number;
  id: string;
};

const AttendanceLineChart = ({
  label,
  sectorBaseName,
  sectorSuffixName,
  unitCaptainId,
  id,
}: AttendanceLineChartProps) => {
  const { data, error, isLoading } = useGetAttendaceLineChartQuery({
    sectorBaseName,
    sectorSuffixName,
    unitCaptainId,
  });

  const mainColor = "183,115,233";

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  let gradient = document
    .createElement("canvas")
    .getContext("2d")
    .createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, `rgba(${mainColor},1)`);
  gradient.addColorStop(1, `rgba(91,16,146,0.1)`);

  const chartData: ChartData<"line"> = {
    labels: data?.body.map((item) => `Week ${item.weekNumber}`),
    datasets: [
      {
        label: label,
        data: data?.body.map((item) => item.absenceRate * 100),
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
        min: -10,
        max: 100,
      },
    },
  };

  return <Line id={id} data={chartData} options={options} />;
};

export default AttendanceLineChart;
