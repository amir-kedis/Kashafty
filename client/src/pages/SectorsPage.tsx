import { useState, useEffect } from "react";
import { useGetSectorsQuery } from "../redux/slices/sectorApiSlice";
import { useGetCaptainsBySectorQuery } from "../redux/slices/captainsApiSlice";
import { useGetScoutsBySectorQuery } from "../redux/slices/scoutApiSlice";
import { useDownloadSectorDataMutation } from "../redux/slices/reportApiSlice";
import PageTitle from "../components/common/PageTitle";
import Button from "../components/common/Button";
import CustomSelect from "../components/common/CustomSelect";
import AbsenceRateTable from "../components/molecules/AbsenceRateTable";
import "./SectorsPage.scss";
import { toast } from "react-toastify";

const SectorsPage = () => {
  const [selectedSector, setSelectedSector] = useState<{
    baseName: string;
    suffixName: string;
  } | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Fetch all sectors
  const {
    data: sectorsData,
    isLoading: isLoadingSectors,
    error: sectorsError,
  } = useGetSectorsQuery({});
  const sectors = sectorsData?.body;

  // Fetch captains and scouts for selected sector
  const { data: captainsData, isLoading: isLoadingCaptains } =
    useGetCaptainsBySectorQuery(
      selectedSector
        ? {
            baseName: selectedSector.baseName,
            suffixName: selectedSector.suffixName,
          }
        : null,
      { skip: !selectedSector }
    );
  const captains = captainsData?.body;

  const { data: scoutsData, isLoading: isLoadingScouts } =
    useGetScoutsBySectorQuery(
      selectedSector
        ? {
            baseName: selectedSector.baseName,
            suffixName: selectedSector.suffixName,
          }
        : null,
      { skip: !selectedSector }
    );
  const scouts = scoutsData?.body;

  // Download data mutation
  const [downloadSectorData] = useDownloadSectorDataMutation();

  // Set first sector as default when data loads
  useEffect(() => {
    if (sectors?.length && !selectedSector) {
      setSelectedSector(sectors[0]);
    }
  }, [sectors, selectedSector]);

  // Handle sector selection
  const handleSectorChange = (sectorId: string) => {
    const [baseName, suffixName] = sectorId.split("_");
    setSelectedSector({ baseName, suffixName });
  };

  // Format sectors for dropdown
  const sectorOptions =
    sectors?.map((sector) => ({
      value: `${sector.baseName}_${sector.suffixName}`,
      label: `${sector.baseName} ${sector.suffixName}`,
    })) || [];

  // Handle download
  const handleDownload = async (
    type: "all" | "captains" | "scouts" | "all_sectors"
  ) => {
    setIsDownloading(true);
    try {
      const response = await downloadSectorData({
        type,
        // Only include sector info for specific sector downloads
        ...(type !== "all_sectors" && selectedSector
          ? {
              baseName: selectedSector.baseName,
              suffixName: selectedSector.suffixName,
            }
          : {}),
      }).unwrap();

      // Create a download link for the Excel file
      const url = window.URL.createObjectURL(response);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        type === "all_sectors"
          ? "all_sectors_data.xlsx"
          : `${selectedSector?.baseName}_${selectedSector?.suffixName}_${type}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("تم تحميل البيانات بنجاح");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("حدث خطأ أثناء تحميل البيانات");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoadingSectors) {
    return <div className="container loading">جاري تحميل القطاعات...</div>;
  }

  if (sectorsError) {
    return <div className="container error">حدث خطأ أثناء تحميل القطاعات</div>;
  }

  return (
    <div className="sectors-page container">
      <PageTitle title="القطاعات" />

      <div className="sector-selector">
        <CustomSelect
          label="اختر القطاع"
          data={sectorOptions}
          selectedValue={
            selectedSector
              ? `${selectedSector.baseName}_${selectedSector.suffixName}`
              : ""
          }
          displayMember="label"
          valueMember="value"
          onChange={(e) => handleSectorChange(e.target.value)}
        />
      </div>

      {selectedSector && (
        <div className="sector-data">
          <div className="section-header">
            <h2>قادة القطاع</h2>
            <Button
              className="Button--medium Button--primary"
              onClick={() => handleDownload("captains")}
              disabled={isDownloading || isLoadingCaptains}
            >
              {isDownloading ? "جاري التحميل..." : "تحميل بيانات القادة"}
            </Button>
          </div>

          <AbsenceRateTable
            data={captains || []}
            isLoading={isLoadingCaptains}
            type="captains"
          />

          <div className="section-header">
            <h2>كشافة القطاع</h2>
            <Button
              className="Button--medium Button--primary"
              onClick={() => handleDownload("scouts")}
              disabled={isDownloading || isLoadingScouts}
            >
              {isDownloading ? "جاري التحميل..." : "تحميل بيانات الكشافة"}
            </Button>
          </div>

          <AbsenceRateTable
            data={scouts || []}
            isLoading={isLoadingScouts}
            type="scouts"
          />

          <div className="download-all">
            <Button
              className="Button--medium Button--success"
              onClick={() => handleDownload("all")}
              disabled={isDownloading || isLoadingCaptains || isLoadingScouts}
            >
              {isDownloading ? "جاري التحميل..." : "تحميل بيانات القطاع"}
            </Button>
            <Button
              className="Button--medium Button--primary"
              onClick={() => handleDownload("all_sectors")}
              disabled={isDownloading}
            >
              {isDownloading ? "جاري التحميل..." : "تحميل بيانات جميع القطاعات"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectorsPage;
