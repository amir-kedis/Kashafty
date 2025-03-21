// client/src/components/delete-scout/DeleteScoutPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import "./DeleteScoutPage.scss";

import PageTitle from "../components/common/PageTitle";
import Button from "../components/common/Button";
import SearchInput from "../components/atoms/SearchInput";
import { useGetScoutsInSectorQuery, useDeleteScoutMutation } from "../redux/slices/scoutApiSlice";
import { toast } from "react-toastify";

const DeleteScoutPage = () => {
  const userInfo = useAuthUser();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedScout, setSelectedScout] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  // Get scouts based on captain's sector or all scouts for general captain
  const sectorParams = userInfo.type === "unit" 
    ? { baseName: userInfo.rSectorBaseName, suffixName: userInfo.rSectorSuffixName } 
    : {};
  
  const { 
    data: scoutsResponse, 
    isLoading, 
    isError, 
    error 
  } = useGetScoutsInSectorQuery(sectorParams);
  const scouts = scoutsResponse?.body;
  
  const [
    deleteScout, 
    { isLoading: isDeleting, isSuccess, isError: isDeleteError, error: deleteError }
  ] = useDeleteScoutMutation();

  // Filter scouts based on search term
  const filteredScouts = scouts?.filter(scout => 
    scout.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Handle scout selection
  const handleScoutSelect = (scout) => {
    setSelectedScout(scout);
    setConfirmDelete(false);
  };

  // Handle deletion
  const handleDelete = async () => {
    if (!confirmDelete) {
      toast.error("يرجى تأكيد الحذف أولاً");
      return;
    }
    
    try {
      await deleteScout(selectedScout.scoutId).unwrap();
      toast.success("تم حذف الكشاف بنجاح");
      setSelectedScout(null);
      setConfirmDelete(false);
    } catch (err) {
      toast.error(err?.data?.arabicMessage || err?.data?.message || "حدث خطأ أثناء حذف الكشاف");
    }
  };

  // Access control - redirect if not authorized
  useEffect(() => {
    if (userInfo.type !== "general" && userInfo.type !== "unit") {
      navigate("/dashboard");
      toast.error("ليس لديك صلاحية للوصول إلى هذه الصفحة");
    }
  }, [userInfo, navigate]);

  if (isLoading) {
    return <div className="container loading">جاري التحميل...</div>;
  }

  if (isError) {
    return (
      <div className="container error">
        حدث خطأ: {error?.data?.arabicMessage || error?.data?.message || "خطأ في تحميل البيانات"}
      </div>
    );
  }

  return (
    <div className="delete-scout-page container">
      <PageTitle title="حذف كشاف" />

      <div className="search-section">
        <SearchInput
          placeholder="ابحث عن كشاف..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {selectedScout && (
        <div className="all-card scout-details">
          <h3>تفاصيل الكشاف</h3>
          <div className="details-container">
            <div className="detail-row">
              <span className="label">الاسم:</span>
              <span className="value">{selectedScout.name}</span>
            </div>
            <div className="detail-row">
              <span className="label">القطاع:</span>
              <span className="value">
                {selectedScout.sectorBaseName} {selectedScout.sectorSuffixName}
              </span>
            </div>
            {selectedScout.phoneNumber && (
              <div className="detail-row">
                <span className="label">رقم الهاتف:</span>
                <span className="value">{selectedScout.phoneNumber}</span>
              </div>
            )}
            {selectedScout.birthDate && (
              <div className="detail-row">
                <span className="label">تاريخ الميلاد:</span>
                <span className="value">
                  {new Date(selectedScout.birthDate).toLocaleDateString(
                    "ar-EG"
                  )}
                </span>
              </div>
            )}
            <div className="detail-row">
              <span className="label">تاريخ الانضمام:</span>
              <span className="value">
                {new Date(selectedScout.createdAt).toLocaleDateString("ar-EG")}
              </span>
            </div>
          </div>

          <div className="delete-confirmation">
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="confirm-delete"
                checked={confirmDelete}
                onChange={(e) => setConfirmDelete(e.target.checked)}
              />
              <label htmlFor="confirm-delete">
                أتفهم أن هذا الإجراء سيحذف الكشاف بشكل دائم ولا يمكن التراجع عنه
              </label>
            </div>

            <Button
              className="Button--medium Button--danger"
              onClick={handleDelete}
              disabled={isDeleting || !confirmDelete}
            >
              {isDeleting ? "جاري الحذف..." : "حذف الكشاف"}
            </Button>
          </div>
        </div>
      )}

      <div className="all-card scouts-list-container">
        <h3>قائمة الكشافة</h3>
        {filteredScouts.length === 0 ? (
          <p className="no-results">لا يوجد كشافة مطابقة للبحث</p>
        ) : (
          <div className="scouts-list">
            {filteredScouts.map((scout) => (
              <div
                key={scout.scoutId}
                className={`scout-item ${
                  selectedScout?.scoutId === scout.scoutId ? "selected" : ""
                }`}
                onClick={() => handleScoutSelect(scout)}
              >
                <div className="scout-name">{scout.name}</div>
                <div className="scout-sector">
                  {scout.sectorBaseName} {scout.sectorSuffixName}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteScoutPage;