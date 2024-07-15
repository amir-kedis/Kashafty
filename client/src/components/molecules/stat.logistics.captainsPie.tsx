import { Pie } from "react-chartjs-2";
import { useGetCaptainGenderDistributionQuery } from "../../redux/slices/stat/stat.logistics.slice";
import { Chart as ChartJS, Title, Legend, Tooltip, ArcElement } from "chart.js";
import { ChartData, ChartOptions } from "chart.js/auto";

ChartJS.register(Title, Legend, Tooltip, ArcElement);

type CaptainGenderDistributionProps = {
  label: string;
};

const CaptainGenderDistributionChart = ({
  label,
}: CaptainGenderDistributionProps) => {
  const { data, error, isLoading } = useGetCaptainGenderDistributionQuery();

  const mainColors = ["#003f5c", "#bc5090"];

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  const chartData: ChartData<"pie"> = {
    labels: ["Male", "Female"],
    datasets: [
      {
        label: label,
        data: [data?.maleRatio ?? 0, data?.femaleRatio ?? 0],
        backgroundColor: mainColors,
        borderWidth: 0,
        hoverOffset: 1,
      },
    ],
  };

  const options: ChartOptions<"pie"> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: label,
      },
    },
  };

  return (
    <div className="chart">
      <Pie
        id="scoutGenderDistributionChart"
        data={chartData}
        options={options}
      />
    </div>
  );
};

export default CaptainGenderDistributionChart;
