import { useState, useEffect } from "react";
import { useGetCaptainsBySectorQuery } from "../redux/slices/captainsApiSlice";
import { useGetScoutsBySectorQuery } from "../redux/slices/scoutApiSlice";
import { useDownloadSectorDataMutation } from "../redux/slices/reportApiSlice";
import PageTitle from "../components/common/PageTitle";
import Button from "../components/common/Button";
import AbsenceRateTable from "../components/molecules/AbsenceRateTable";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import "./SectorPage.scss";
import { toast } from "react-toastify";

const SectorPage = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Get the authenticated user
  const user = useAuthUser();
  
  // Extract the captain's sector from the auth user
  const captainSector = user && {
    baseName: user.rSectorBaseName,
    suffixName: user.rSectorSuffixName
  };

  // Fetch captains and scouts for the captain's sector
  const { data: captainsData, isLoading: isLoadingCaptains } = useGetCaptainsBySectorQuery(
    captainSector ? {
      baseName: captainSector.baseName,
      suffixName: captainSector.suffixName,
    } : null,
    { skip: !captainSector }
  );
  const captains = captainsData?.body;

  const { data: scoutsData, isLoading: isLoadingScouts } = useGetScoutsBySectorQuery(
    captainSector ? {
      baseName: captainSector.baseName,
      suffixName: captainSector.suffixName,
    } : null,
    { skip: !captainSector }
  );
  const scouts = scoutsData?.body;

  // Download data mutation
  const [downloadSectorData] = useDownloadSectorDataMutation();

  // Handle download
  const handleDownload = async (type: "all" | "captains" | "scouts") => {
    if (!captainSector) {
      toast.error("لم يتم العثور على معلومات القطاع");
      return;
    }
    
    setIsDownloading(true);
    try {
      const response = await downloadSectorData({
        type,
        baseName: captainSector.baseName,
        suffixName: captainSector.suffixName,
      }).unwrap();

      // Create a download link for the Excel file
      const url = window.URL.createObjectURL(response);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${captainSector.baseName}_${captainSector.suffixName}_${type}.xlsx`
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

  // If no sector is assigned to the captain
  if (!captainSector || !captainSector.baseName || !captainSector.suffixName) {
    return (
      <div className="sector-page container">
        <PageTitle title="قطاعي" />
        <div className="no-sector">
          <h3>لم يتم تعيينك في أي قطاع</h3>
          <p>يرجى التواصل مع المسؤول لتعيينك في قطاع</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sector-page container">
      <PageTitle title="قطاعي" />
      
      <div className="sector-info">
        <h2>{`قطاع ${captainSector.baseName} ${captainSector.suffixName}`}</h2>
      </div>

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
        </div>
      </div>
    </div>
  );
};

export default SectorPage;