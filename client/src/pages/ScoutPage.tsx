import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetScoutByIdQuery } from "../redux/slices/scoutApiSlice";
import { useGetScoutAttendanceHistoryQuery, useGetScoutAttendanceStatsQuery } from "../redux/slices/attendanceApiSlice";
import PageTitle from "../components/common/PageTitle";
import Button from "../components/common/Button";
import AttendanceLineChart from "../components/molecules/stat.attendance.line";

import { Line } from "react-chartjs-2";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

import "./ScoutPage.scss";

const ScoutPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const scoutId = id ? parseInt(id) : 0;
  
  // Fetch scout details
  const { 
    data: scoutData, 
    isLoading: isLoadingScout, 
    error: scoutError 
  } = useGetScoutByIdQuery(scoutId);
  
  // Fetch scout attendance history
  const { 
    data: attendanceHistoryData, 
    isLoading: isLoadingHistory 
  } = useGetScoutAttendanceHistoryQuery(scoutId);
  
  // Fetch scout attendance stats by term
  const { 
    data: attendanceStatsData, 
    isLoading: isLoadingStats 
  } = useGetScoutAttendanceStatsQuery(scoutId);
  
  const scout = scoutData?.body;
  const attendanceHistory = attendanceHistoryData?.body || [];
  const attendanceStats = attendanceStatsData?.body || [];
  
  // Current term attendance data for chart
  const currentTermAttendance = attendanceHistory.filter(
    history => history.termNumber === Math.max(...attendanceHistory.map(h => h.termNumber))
  );
  
  // Prepare chart data
  const chartData = {
    labels: currentTermAttendance.map(item => `الأسبوع ${item.weekNumber}`),
    datasets: [
      {
        label: 'حضور الكشاف',
        data: currentTermAttendance.map(item => item.attendanceStatus === 'attended' ? 100 : 0),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value === 0 ? 'غائب' : value === 100 ? 'حاضر' : '';
          }
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.raw === 0 ? 'غائب' : 'حاضر';
          }
        }
      }
    }
  };
  
  // Calculate overall attendance rate
  const calculateOverallRate = () => {
    if (!attendanceHistory.length) return 0;
    
    const attended = attendanceHistory.filter(a => a.attendanceStatus === 'attended').length;
    return (attended / attendanceHistory.length) * 100;
  };
  
  const overallRate = calculateOverallRate();
  
  // Get attendance status class based on rate
  const getAttendanceStatusClass = (rate: number) => {
    if (rate >= 75) return 'excellent';
    if (rate >= 50) return 'good';
    if (rate >= 25) return 'warning';
    return 'danger';
  };
  
  if (isLoadingScout) {
    return <div className="container loading">جاري تحميل بيانات الكشاف...</div>;
  }
  
  if (scoutError || !scout) {
    return (
      <div className="container error">
        <h3>حدث خطأ أثناء تحميل بيانات الكشاف</h3>
        <Button className="Button--medium Button--primary" onClick={() => navigate(-1)}>
          العودة
        </Button>
      </div>
    );
  }
  
  return (
    <div className="scout-page container">
      <div className="page-header">
        <PageTitle title={`بيانات الكشاف: ${scout.name}`} />
      </div>
      
      <div className="scout-info-card">
        <div className="scout-details">
          <div className="detail-group">
            <h3>المعلومات الشخصية</h3>
            <div className="detail-item">
              <span className="label">الاسم:</span>
              <span className="value">{scout.name}</span>
            </div>
            <div className="detail-item">
              <span className="label">القطاع:</span>
              <span className="value">{scout.sectorBaseName} {scout.sectorSuffixName}</span>
            </div>
            <div className="detail-item">
              <span className="label">رقم الهاتف:</span>
              <span className="value">{scout.phoneNumber || 'غير متوفر'}</span>
            </div>
            <div className="detail-item">
              <span className="label">تاريخ الميلاد:</span>
              <span className="value">
                {scout.birthDate ? format(new Date(scout.birthDate), 'dd MMMM yyyy', { locale: ar }) : 'غير متوفر'}
              </span>
            </div>
            <div className="detail-item">
              <span className="label">العنوان:</span>
              <span className="value">{scout.address || 'غير متوفر'}</span>
            </div>
            <div className="detail-item">
              <span className="label">الفرقة:</span>
              <span className="value">{scout.group || 'غير متوفر'}</span>
            </div>
          </div>
          
          <div className="detail-group">
            <h3>إحصائيات الحضور</h3>
            <div className="attendance-summary">
              <div className="rate-circle">
                <div className={`circle ${getAttendanceStatusClass(overallRate)}`}>
                  <span className="rate-value">{overallRate.toFixed(1)}%</span>
                </div>
                <span className="rate-label">نسبة الحضور الكلية</span>
              </div>
              
              <div className="attendance-counts">
                <div className="count-item attended">
                  <span className="count">
                    {attendanceHistory.filter(a => a.attendanceStatus === 'attended').length}
                  </span>
                  <span className="label">حضور</span>
                </div>
                <div className="count-item absent">
                  <span className="count">
                    {attendanceHistory.filter(a => a.attendanceStatus === 'absent').length}
                  </span>
                  <span className="label">غياب</span>
                </div>
                <div className="count-item total">
                  <span className="count">{attendanceHistory.length}</span>
                  <span className="label">إجمالي</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="attendance-section">
        <h3>حضور الفترة الحالية</h3>
        <div className="attendance-chart">
          {isLoadingHistory ? (
            <div className="loading">جاري تحميل بيانات الحضور...</div>
          ) : currentTermAttendance.length > 0 ? (
            <div className="chart-container">
              <Line data={chartData} options={chartOptions} height={300} />
            </div>
          ) : (
            <div className="no-data">لا توجد بيانات حضور للفترة الحالية</div>
          )}
        </div>
      </div>
      
      <div className="attendance-history-section">
        <h3>سجل الحضور</h3>
        {isLoadingHistory ? (
          <div className="loading">جاري تحميل سجل الحضور...</div>
        ) : (
          <div className="attendance-tables">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>الأسبوع</th>
                  <th>الفترة</th>
                  <th>التاريخ</th>
                  <th>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {attendanceHistory.map((record, index) => (
                  <tr key={index}>
                    <td>{record.weekNumber}</td>
                    <td>{record.termNumber}</td>
                    <td>{format(new Date(record.date), 'dd/MM/yyyy')}</td>
                    <td className={record.attendanceStatus === 'attended' ? 'status-attended' : 'status-absent'}>
                      {record.attendanceStatus === 'attended' ? 'حاضر' : 'غائب'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="terms-stats-section">
        <h3>إحصائيات الحضور حسب الفترة</h3>
        {isLoadingStats ? (
          <div className="loading">جاري تحميل الإحصائيات...</div>
        ) : attendanceStats.length > 0 ? (
          <div className="terms-stats">
            <table className="terms-table">
              <thead>
                <tr>
                  <th>الفترة</th>
                  <th>اسم الفترة</th>
                  <th>عدد الحضور</th>
                  <th>عدد الغياب</th>
                  <th>نسبة الحضور</th>
                </tr>
              </thead>
              <tbody>
                {attendanceStats.map((term, index) => {
                  const attendedCount = term.attended || 0;
                  const absentCount = term.absent || 0;
                  const totalDays = attendedCount + absentCount;
                  const attendanceRate = totalDays > 0 ? (attendedCount / totalDays) * 100 : 0;
                  
                  return (
                    <tr key={index}>
                      <td>{term.termNumber}</td>
                      <td>{term.termName || '-'}</td>
                      <td>{attendedCount}</td>
                      <td>{absentCount}</td>
                      <td className={`status-${getAttendanceStatusClass(attendanceRate)}`}>
                        {attendanceRate.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data">لا توجد إحصائيات متاحة</div>
        )}
      </div>
    </div>
  );
};

export default ScoutPage;
