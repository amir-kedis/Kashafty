import { Line } from "react-chartjs-2";
import { useGetAttendanceStackedChartQuery } from "../../redux/slices/stat/stat.attendance.slice";
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
import { useRef } from "react";

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
};

const AttendanceStackedChart = ({ label }: AttendanceLineChartProps) => {
  const { data, error, isLoading } = useGetAttendanceStackedChartQuery();

  const mainColors = [
    "183,115,233",
    "255,99,132",
    "54,162,235",
    "75,192,192",
    "153,102,255",
    "255,159,64",
  ];

  const chartContainerRef = useRef<HTMLCanvasElement | null>(null);
  const gradients: any[] = [];

  mainColors.forEach((color) => {
    let gradient = document
      .createElement("canvas")
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, `rgba(${color},1)`);
    gradient.addColorStop(1, `rgba(${color},0)`);
    gradients.push(gradient);
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  const labels = data?.body[0]?.attendanceRates.map(
    (item) => `Week ${item.weekNumber}`,
  );

  const chartData: ChartData<"line"> = {
    labels,
    datasets: data?.body.map((sector, index) => ({
      label: `${sector.sectorBaseName} ${sector.sectorSuffixName}`,
      data: sector.attendanceRates.map((rate) => rate.absenceRate * 100),
      fill: true,
      backgroundColor: gradients[index % gradients.length],
      borderColor: `rgba(${mainColors[index % mainColors.length]},1)`,
      cubicInterpolationMode: "monotone",
      tension: 0.4,
    })),
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
      filler: {
        propagate: true,
      },
    },
    scales: {
      y: {
        min: -10,
        max: 100,
      },
    },
  };

  return (
    <div>
      <canvas ref={chartContainerRef} style={{ display: "none" }}></canvas>
      <Line id="attendanceLineChart" data={chartData} options={options} />
    </div>
  );
};

export default AttendanceStackedChart;
