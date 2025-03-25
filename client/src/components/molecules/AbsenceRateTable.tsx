import { useState, useMemo } from "react";
import "./AbsenceRateTable.scss";
import { Link } from "react-router-dom";

interface AbsenceRateTableProps {
  data: any[];
  isLoading: boolean;
  type: "captains" | "scouts";
}

const AbsenceRateTable = ({ data, isLoading, type }: AbsenceRateTableProps) => {
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Process data with filtering and sorting
  const processedData = useMemo(() => {
    // First apply search filter
    let filteredData = data.filter((item) => {
      const searchName =
        type === "captains"
          ? `${item.firstName} ${item.middleName || ""} ${
              item.lastName || ""
            }`.toLowerCase()
          : item.name.toLowerCase();

      return searchTerm === "" || searchName.includes(searchTerm.toLowerCase());
    });

    // Then apply status filter
    if (filterStatus !== "all") {
      filteredData = filteredData.filter((item) => {
        const attendedCount = item.attendedCount || 0;
        const absentCount = item.absentCount || 0;
        const totalDays = attendedCount + absentCount;
        const attendanceRate =
          totalDays > 0 ? (attendedCount / totalDays) * 100 : 0;

        switch (filterStatus) {
          case "excellent":
            return attendanceRate >= 75;
          case "good":
            return attendanceRate >= 50 && attendanceRate < 75;
          case "warning":
            return attendanceRate >= 25 && attendanceRate < 50;
          case "danger":
            return attendanceRate < 25;
          default:
            return true;
        }
      });
    }

    // Finally sort the data
    if (sortField) {
      filteredData = [...filteredData].sort((a, b) => {
        let aValue, bValue;

        if (sortField === "name") {
          aValue =
            type === "captains"
              ? `${a.firstName} ${a.middleName || ""} ${a.lastName || ""}`
              : a.name;
          bValue =
            type === "captains"
              ? `${b.firstName} ${b.middleName || ""} ${b.lastName || ""}`
              : b.name;
        } else if (sortField === "role" && type === "captains") {
          aValue = a.type;
          bValue = b.type;
        } else if (sortField === "attendanceRate") {
          const aAttended = a.attendedCount || 0;
          const aAbsent = a.absentCount || 0;
          const aTotalDays = aAttended + aAbsent;
          aValue = aTotalDays > 0 ? (aAttended / aTotalDays) * 100 : 0;

          const bAttended = b.attendedCount || 0;
          const bAbsent = b.absentCount || 0;
          const bTotalDays = bAttended + bAbsent;
          bValue = bTotalDays > 0 ? (bAttended / bTotalDays) * 100 : 0;
        } else {
          aValue = a[sortField] || 0;
          bValue = b[sortField] || 0;
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filteredData;
  }, [data, searchTerm, filterStatus, sortField, sortDirection, type]);

  if (isLoading) {
    return <div className="loading-indicator">جاري تحميل البيانات...</div>;
  }

  if (!data.length) {
    return <div className="no-data">لا توجد بيانات متاحة</div>;
  }

  // Render sort indicator
  const renderSortIndicator = (field: string) => {
    if (sortField !== field) return null;
    return (
      <span className="sort-indicator">
        {sortDirection === "asc" ? " ▲" : " ▼"}
      </span>
    );
  };

  return (
    <div className="absence-rate-table-container">
      <div className="table-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="بحث بالاسم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-container">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">جميع الحالات</option>
            <option value="excellent">ممتاز</option>
            <option value="good">جيد</option>
            <option value="warning">تحذير</option>
            <option value="danger">خطر</option>
          </select>
        </div>
      </div>

      <div className="table-info">
        <span>عدد النتائج: {processedData.length}</span>
      </div>

      <table className="absence-rate-table">
        <thead>
          <tr>
            <th>#</th>
            <th className="sortable-header" onClick={() => handleSort("name")}>
              الاسم {renderSortIndicator("name")}
            </th>
            {type === "captains" && (
              <th
                className="sortable-header"
                onClick={() => handleSort("role")}
              >
                الدور {renderSortIndicator("role")}
              </th>
            )}
            <th
              className="sortable-header"
              onClick={() => handleSort("attendedCount")}
            >
              عدد الحضور {renderSortIndicator("attendedCount")}
            </th>
            <th
              className="sortable-header"
              onClick={() => handleSort("absentCount")}
            >
              عدد الغياب {renderSortIndicator("absentCount")}
            </th>
            <th
              className="sortable-header"
              onClick={() => handleSort("attendanceRate")}
            >
              نسبة الحضور {renderSortIndicator("attendanceRate")}
            </th>
            <th>الحالة</th>
          </tr>
        </thead>
        <tbody>
          {processedData.map((item, index) => {
            const attendedCount = item.attendedCount || 0;
            const absentCount = item.absentCount || 0;
            const totalDays = attendedCount + absentCount;
            const attendanceRate =
              totalDays > 0 ? (attendedCount / totalDays) * 100 : 0;

            let statusClass = "";
            let statusText = "";

            if (attendanceRate >= 75) {
              statusClass = "status-excellent";
              statusText = "ممتاز";
            } else if (attendanceRate >= 50) {
              statusClass = "status-good";
              statusText = "جيد";
            } else if (attendanceRate >= 25) {
              statusClass = "status-warning";
              statusText = "تحذير";
            } else {
              statusClass = "status-danger";
              statusText = "خطر";
            }

            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  {type === "captains" ? (
                    `${item.firstName} ${item.middleName || ""} ${
                      item.lastName || ""
                    }`
                  ) : (
                    <Link to={`/scout/${item.scoutId}`} className="scout-link">
                      {item.name}
                    </Link>
                  )}
                </td>
                {type === "captains" && (
                  <td>{getCaptainRoleText(item.type)}</td>
                )}
                <td>{attendedCount}</td>
                <td>{absentCount}</td>
                <td>{attendanceRate.toFixed(1)}%</td>
                <td className={statusClass}>{statusText}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {processedData.length === 0 && (
        <div className="no-results">لا توجد نتائج تطابق البحث</div>
      )}
    </div>
  );
};

// Helper function to get role text in Arabic
function getCaptainRoleText(type: string): string {
  switch (type) {
    case "general":
      return "قائد عام";
    case "unit":
      return "قائد وحدة";
    case "regular":
      return "قائد";
    default:
      return type;
  }
}

export default AbsenceRateTable;
