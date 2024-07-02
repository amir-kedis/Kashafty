import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import { useGetSectorsQuery } from "../../redux/slices/sectorApiSlice";
import CustomSelect from "../common/CustomSelect";
import { useGetGraphDataQuery } from "../../redux/slices/statsApiSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export default function AbsenceInfo() {
  const data = {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    datasets: [
      {
        label: "تغير نسبة الغياب",
        data: [90, 89, 88, 87, 100, 85, 84, 60, 82, 81, 66, 70, 77, 40],
        borderColor: "rgb(75, 192, 192)",
        fill: false,
        cubicInterpolationMode: "monotone",
        tension: 0.4,
      },
    ],
  };

  const [chosenSectorFullName, setChosenSectorFullName] = useState("");

  let {
    data: sectors,
    isFetching: isFetchingSectors,
    isSuccess: isSuccessSectors,
  } = useGetSectorsQuery();

  if (isSuccessSectors) {
    console.log({ sectors: sectors?.body });
    sectors = sectors?.body;
  }

  const { data: absenceData, isSuccess: isSuccessAbsenceData } =
    useGetGraphDataQuery(chosenSectorFullName);

  let dataArr = [];

  if (isSuccessAbsenceData) {
    console.log({ absenceData: absenceData?.body });

    dataArr = absenceData?.body?.map((item) => {
      return item?.absenceRate ? item?.absenceRate * 100 : 0;
    });

    console.log({ dataArr });
    data.datasets[0].data = dataArr;
  }

  return (
    <div className="absence-info">
      <h4>الغياب</h4>
      {/* <InfoBox
        title="نسبة الغياب"
        value={
          isFetchingAbsenceData
            ? "جاري التحميل"
            : dataArr?.length > 0
            ? Math.round(dataArr[dataArr.length - 1]) + "%"
            : "لا يوجد بيانات"
        }
        color="purple"
      /> */}
      <Line data={data} />
      <h4
        style={{
          marginBlock: "2rem",
        }}
      >
        غياب القطاعات
      </h4>
      <CustomSelect
        name={"choose-sector"}
        label={"أختر القطاع"}
        data={
          isFetchingSectors
            ? [{ sectorId: "", fullName: "جاري التحميل" }]
            : !sectors
              ? [{ sectorId: "", fullName: "لا يوجد قطاعات" }]
              : sectors?.map((sector) => ({
                  ...sector,
                  fullName: sector.baseName + " - " + sector.suffixName,
                }))
        }
        displayMember={"fullName"}
        valueMember={"fullName"}
        selectedValue={chosenSectorFullName}
        required={true}
        onChange={(e) => {
          setChosenSectorFullName(e.target.value);
        }}
      />
    </div>
  );
}
