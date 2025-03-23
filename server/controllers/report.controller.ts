import { Request, Response } from 'express';
import { prisma } from '../database/db';
import asyncDec from '../utils/asyncDec';
import AppError from '../utils/AppError';
import ExcelJS from 'exceljs';

interface SectorDataRequest extends Request {
  body: {
    type: 'all' | 'captains' | 'scouts' | 'all_sectors';
    baseName?: string;
    suffixName?: string;
  };
}

const reportController = {
  generateSectorData: asyncDec(async (req: SectorDataRequest, res: Response) => {
    const { type, baseName, suffixName } = req.body;
    
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Scout System';
    workbook.created = new Date();
    
    // Get current term
    const currentTerm = await prisma.term.findFirst({
      orderBy: { termNumber: 'desc' },
    });
    
    if (!currentTerm) {
      throw new AppError(404, 'No active term found', 'لا يوجد فترة نشطة');
    }
    
    // If type is all_sectors, generate data for all sectors
    if (type === 'all_sectors') {
      // Get all sectors
      const sectors = await prisma.sector.findMany({
        include: {
          Captain_Sector_unitCaptainIdToCaptain: true,
        },
      });
      
      // Create summary sheet
      const summarySheet = workbook.addWorksheet('ملخص القطاعات');
      
      // Add headers for summary
      summarySheet.columns = [
        { header: 'القطاع', key: 'sectorName', width: 25 },
        { header: 'قائد الوحدة', key: 'unitCaptain', width: 30 },
        { header: 'عدد القادة', key: 'captainsCount', width: 15 },
        { header: 'عدد الكشافة', key: 'scoutsCount', width: 15 },
        { header: 'متوسط حضور القادة', key: 'captainAttendance', width: 20 },
        { header: 'متوسط حضور الكشافة', key: 'scoutAttendance', width: 20 },
      ];
      
      // Style the headers
      const headerRow = summarySheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.alignment = { horizontal: 'right' };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4B5563' }, // Grey-600
      };
      headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
      
      // Set RTL direction for the sheet
      summarySheet.views = [{ rightToLeft: true }];
      
      // Process each sector
      for (const sector of sectors) {
        const sectorName = `${sector.baseName} ${sector.suffixName}`;
        
        // Get captains for this sector
        const captains = await prisma.captain.findMany({
          where: {
            rSectorBaseName: sector.baseName,
            rSectorSuffixName: sector.suffixName,
          },
          include: {
            CaptainAttendance: {
              where: {
                Week: {
                  termNumber: currentTerm.termNumber,
                },
              },
            },
          },
        });
        
        // Get scouts for this sector
        const scouts = await prisma.scout.findMany({
          where: {
            sectorBaseName: sector.baseName,
            sectorSuffixName: sector.suffixName,
          },
          include: {
            ScoutAttendance: {
              where: {
                Week: {
                  termNumber: currentTerm.termNumber,
                },
              },
            },
          },
        });
        
        // Calculate attendance statistics
        let captainTotalAttended = 0;
        let captainTotalAbsent = 0;
        let captainTotalRate = 0;
        
        captains.forEach(captain => {
          const attendedCount = captain.CaptainAttendance.filter(
            a => a.attendanceStatus === 'attended'
          ).length;
          
          const absentCount = captain.CaptainAttendance.filter(
            a => a.attendanceStatus === 'absent'
          ).length;
          
          const totalDays = attendedCount + absentCount;
          const attendanceRate = totalDays > 0 ? (attendedCount / totalDays) * 100 : 0;
          
          captainTotalAttended += attendedCount;
          captainTotalAbsent += absentCount;
          captainTotalRate += attendanceRate;
        });
        
        let scoutTotalAttended = 0;
        let scoutTotalAbsent = 0;
        let scoutTotalRate = 0;
        
        scouts.forEach(scout => {
          const attendedCount = scout.ScoutAttendance.filter(
            a => a.attendanceStatus === 'attended'
          ).length;
          
          const absentCount = scout.ScoutAttendance.filter(
            a => a.attendanceStatus === 'absent'
          ).length;
          
          const totalDays = attendedCount + absentCount;
          const attendanceRate = totalDays > 0 ? (attendedCount / totalDays) * 100 : 0;
          
          scoutTotalAttended += attendedCount;
          scoutTotalAbsent += absentCount;
          scoutTotalRate += attendanceRate;
        });
        
        // Calculate averages
        const captainAvgAttendance = captains.length > 0 
          ? (captainTotalRate / captains.length).toFixed(1) + '%'
          : '0%';
          
        const scoutAvgAttendance = scouts.length > 0 
          ? (scoutTotalRate / scouts.length).toFixed(1) + '%'
          : '0%';
        
        // Add to summary sheet
        summarySheet.addRow({
          sectorName,
          unitCaptain: sector.Captain_Sector_unitCaptainIdToCaptain 
            ? `${sector.Captain_Sector_unitCaptainIdToCaptain.firstName} ${sector.Captain_Sector_unitCaptainIdToCaptain.middleName || ''} ${sector.Captain_Sector_unitCaptainIdToCaptain.lastName || ''}`
            : 'غير معين',
          captainsCount: captains.length,
          scoutsCount: scouts.length,
          captainAttendance: captainAvgAttendance,
          scoutAttendance: scoutAvgAttendance,
        });
        
        // Create captains worksheet for this sector
        const captainsSheet = workbook.addWorksheet(`قادة ${sectorName}`);
        
        // Add headers for captains
        captainsSheet.columns = [
          { header: 'الرقم', key: 'id', width: 10 },
          { header: 'الاسم الأول', key: 'firstName', width: 20 },
          { header: 'الاسم الأوسط', key: 'middleName', width: 20 },
          { header: 'الاسم الأخير', key: 'lastName', width: 20 },
          { header: 'رقم الهاتف', key: 'phoneNumber', width: 20 },
          { header: 'البريد الإلكتروني', key: 'email', width: 25 },
          { header: 'الجنس', key: 'gender', width: 10 },
          { header: 'الدور', key: 'role', width: 15 },
          { header: 'عدد الحضور', key: 'attended', width: 15 },
          { header: 'عدد الغياب', key: 'absent', width: 15 },
          { header: 'نسبة الحضور', key: 'rate', width: 15 },
        ];
        
        // Add captain rows
        captains.forEach((captain, index) => {
          const attendedCount = captain.CaptainAttendance.filter(
            a => a.attendanceStatus === 'attended'
          ).length;
          
          const absentCount = captain.CaptainAttendance.filter(
            a => a.attendanceStatus === 'absent'
          ).length;
          
          const totalDays = attendedCount + absentCount;
          const attendanceRate = totalDays > 0 ? (attendedCount / totalDays) * 100 : 0;
          
          captainsSheet.addRow({
            id: index + 1,
            firstName: captain.firstName,
            middleName: captain.middleName || '',
            lastName: captain.lastName || '',
            phoneNumber: captain.phoneNumber || '',
            email: captain.email || '',
            gender: captain.gender === 'male' ? 'ذكر' : 'أنثى',
            role: getCaptainRoleText(captain.type),
            attended: attendedCount,
            absent: absentCount,
            rate: `${attendanceRate.toFixed(1)}%`,
          });
        });
        
        // Style captains headers
        const captainsHeaderRow = captainsSheet.getRow(1);
        captainsHeaderRow.font = { bold: true };
        captainsHeaderRow.alignment = { horizontal: 'right' };
        captainsHeaderRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '4B5563' }, // Grey-600
        };
        captainsHeaderRow.font = { bold: true, color: { argb: 'FFFFFF' } };
        
        // Set RTL direction for captains sheet
        captainsSheet.views = [{ rightToLeft: true }];
        
        // Create scouts worksheet for this sector
        const scoutsSheet = workbook.addWorksheet(`كشافة ${sectorName}`);
        
        // Add headers for scouts
        scoutsSheet.columns = [
          { header: 'الرقم', key: 'id', width: 10 },
          { header: 'الاسم', key: 'name', width: 30 },
          { header: 'رقم الهاتف', key: 'phoneNumber', width: 20 },
          { header: 'تاريخ الميلاد', key: 'birthDate', width: 15 },
          { header: 'العنوان', key: 'address', width: 30 },
          { header: 'عدد الحضور', key: 'attended', width: 15 },
          { header: 'عدد الغياب', key: 'absent', width: 15 },
          { header: 'نسبة الحضور', key: 'rate', width: 15 },
        ];
        
        // Add scout rows
        scouts.forEach((scout, index) => {
          const attendedCount = scout.ScoutAttendance.filter(
            a => a.attendanceStatus === 'attended'
          ).length;
          
          const absentCount = scout.ScoutAttendance.filter(
            a => a.attendanceStatus === 'absent'
          ).length;
          
          const totalDays = attendedCount + absentCount;
          const attendanceRate = totalDays > 0 ? (attendedCount / totalDays) * 100 : 0;
          
          scoutsSheet.addRow({
            id: index + 1,
            name: scout.name,
            phoneNumber: scout.phoneNumber || '',
            birthDate: scout.birthDate ? new Date(scout.birthDate).toLocaleDateString('ar-EG') : '',
            address: scout.address || '',
            attended: attendedCount,
            absent: absentCount,
            rate: `${attendanceRate.toFixed(1)}%`,
          });
        });
        
        // Style scouts headers
        const scoutsHeaderRow = scoutsSheet.getRow(1);
        scoutsHeaderRow.font = { bold: true };
        scoutsHeaderRow.alignment = { horizontal: 'right' };
        scoutsHeaderRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '4B5563' }, // Grey-600
        };
        scoutsHeaderRow.font = { bold: true, color: { argb: 'FFFFFF' } };
        
        // Set RTL direction for scouts sheet
        scoutsSheet.views = [{ rightToLeft: true }];
      }
    } else {
      // For single sector reports
      if (!baseName || !suffixName) {
        throw new AppError(400, 'Sector information is required', 'معلومات القطاع مطلوبة');
      }
      
      // Get sector info
      const sector = await prisma.sector.findFirst({
        where: {
          baseName,
          suffixName,
        },
        include: {
          Captain_Sector_unitCaptainIdToCaptain: true,
        },
      });
      
      if (!sector) {
        throw new AppError(404, 'Sector not found', 'لم يتم العثور على القطاع');
      }
      
      // Create summary sheet
      const summarySheet = workbook.addWorksheet('ملخص');
      summarySheet.columns = [
        { header: 'المعلومات', key: 'info', width: 30 },
        { header: 'القيمة', key: 'value', width: 40 },
      ];
      
      // Add sector info to summary
      summarySheet.addRow({ 
        info: 'اسم القطاع', 
        value: `${baseName} ${suffixName}` 
      });
      
      summarySheet.addRow({ 
        info: 'قائد الوحدة', 
        value: sector?.Captain_Sector_unitCaptainIdToCaptain 
          ? `${sector.Captain_Sector_unitCaptainIdToCaptain.firstName} ${sector.Captain_Sector_unitCaptainIdToCaptain.middleName || ''} ${sector.Captain_Sector_unitCaptainIdToCaptain.lastName || ''}` 
          : 'غير معين' 
      });
      
      summarySheet.addRow({ 
        info: 'الفترة الحالية', 
        value: `${currentTerm.termNumber} (${currentTerm.termName || ''})` 
      });
      
      summarySheet.addRow({ 
        info: 'تاريخ التقرير', 
        value: new Date().toLocaleDateString('ar-EG') 
      });
      
      // Style the summary sheet
      summarySheet.getRow(1).font = { bold: true };
      summarySheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4B5563' }, // Grey-600
      };
      summarySheet.getRow(1).font = { color: { argb: 'FFFFFF' } };
      
      // Set RTL direction for the sheet
      summarySheet.views = [{ rightToLeft: true }];
      
      // Generate data based on type
      if (type === 'all' || type === 'captains') {
        // Get captains data
        const captains = await prisma.captain.findMany({
          where: {
            rSectorBaseName: baseName,
            rSectorSuffixName: suffixName,
          },
          include: {
            CaptainAttendance: {
              where: {
                Week: {
                  termNumber: currentTerm.termNumber,
                },
              },
            },
          },
        });
        
        // Calculate captain statistics for summary
        let totalAttended = 0;
        let totalAbsent = 0;
        let totalRate = 0;
        
        captains.forEach(captain => {
          const attendedCount = captain.CaptainAttendance.filter(
            a => a.attendanceStatus === 'attended'
          ).length;
          
          const absentCount = captain.CaptainAttendance.filter(
            a => a.attendanceStatus === 'absent'
          ).length;
          
          const totalDays = attendedCount + absentCount;
          const attendanceRate = totalDays > 0 ? (attendedCount / totalDays) * 100 : 0;
          
          totalAttended += attendedCount;
          totalAbsent += absentCount;
          totalRate += attendanceRate;
        });
        
        // Add captain statistics to summary
        summarySheet.addRow({ info: '', value: '' }); // Empty row
        summarySheet.addRow({ 
          info: 'إحصائيات القادة', 
          value: '' 
        });
        summarySheet.getRow(summarySheet.rowCount).font = { bold: true };
        
        summarySheet.addRow({ 
          info: 'عدد القادة', 
          value: captains.length 
        });
        
        summarySheet.addRow({ 
          info: 'إجمالي الحضور', 
          value: totalAttended 
        });
        
        summarySheet.addRow({ 
          info: 'إجمالي الغياب', 
          value: totalAbsent 
        });
        
        summarySheet.addRow({ 
          info: 'متوسط نسبة الحضور', 
          value: captains.length > 0 ? `${(totalRate / captains.length).toFixed(1)}%` : '0%' 
        });
        
        // Create captains worksheet
        const captainsSheet = workbook.addWorksheet(`قادة ${baseName} ${suffixName}`);
        
        // Add headers with all fields
        captainsSheet.columns = [
          { header: 'الرقم', key: 'id', width: 10 },
          { header: 'الاسم الأول', key: 'firstName', width: 20 },
          { header: 'الاسم الأوسط', key: 'middleName', width: 20 },
          { header: 'الاسم الأخير', key: 'lastName', width: 20 },
          { header: 'رقم الهاتف', key: 'phoneNumber', width: 20 },
          { header: 'البريد الإلكتروني', key: 'email', width: 25 },
          { header: 'الجنس', key: 'gender', width: 10 },
          { header: 'الدور', key: 'role', width: 15 },
          { header: 'عدد الحضور', key: 'attended', width: 15 },
          { header: 'عدد الغياب', key: 'absent', width: 15 },
          { header: 'نسبة الحضور', key: 'rate', width: 15 },
          { header: 'الحالة', key: 'status', width: 15 },
        ];
        
        // Add rows
        captains.forEach((captain, index) => {
          const attendedCount = captain.CaptainAttendance.filter(
            a => a.attendanceStatus === 'attended'
          ).length;
          
          const absentCount = captain.CaptainAttendance.filter(
            a => a.attendanceStatus === 'absent'
          ).length;
          
          const totalDays = attendedCount + absentCount;
          const attendanceRate = totalDays > 0 ? (attendedCount / totalDays) * 100 : 0;
          
          let status = '';
          if (attendanceRate >= 75) status = 'ممتاز';
          else if (attendanceRate >= 50) status = 'جيد';
          else if (attendanceRate >= 25) status = 'تحذير';
          else status = 'خطر';
          
          captainsSheet.addRow({
            id: index + 1,
            firstName: captain.firstName,
            middleName: captain.middleName || '',
            lastName: captain.lastName || '',
            phoneNumber: captain.phoneNumber || '',
            email: captain.email || '',
            gender: captain.gender === 'male' ? 'ذكر' : 'أنثى',
            role: getCaptainRoleText(captain.type),
            attended: attendedCount,
            absent: absentCount,
            rate: `${attendanceRate.toFixed(1)}%`,
            status,
          });
          
          // Add conditional formatting for status
          const rowIndex = index + 2; // +2 because of header row
          const statusCell = captainsSheet.getCell(`L${rowIndex}`);
          
          if (attendanceRate >= 75) {
            statusCell.font = { color: { argb: '31C48D' } }; // Green-400
          } else if (attendanceRate >= 50) {
            statusCell.font = { color: { argb: '16BDCA' } }; // Teal-400
          } else if (attendanceRate >= 25) {
            statusCell.font = { color: { argb: 'FACA15' } }; // Yellow-400
          } else {
            statusCell.font = { color: { argb: 'F05252' } }; // Red-400
          }
        });
        
        // Style the headers
        const headerRow = captainsSheet.getRow(1);
        headerRow.font = { bold: true };
        headerRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '4B5563' }, // Grey-600
        };
        headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
        headerRow.alignment = { horizontal: 'right' };
        
        // Set RTL direction for the sheet
        captainsSheet.views = [{ rightToLeft: true }];
      }
      
      if (type === 'all' || type === 'scouts') {
        // Get scouts data
        const scouts = await prisma.scout.findMany({
          where: {
            sectorBaseName: baseName,
            sectorSuffixName: suffixName,
          },
          include: {
            ScoutAttendance: {
              where: {
                Week: {
                  termNumber: currentTerm.termNumber,
                },
              },
            },
          },
        });
        
        // Calculate scout statistics for summary
        let totalAttended = 0;
        let totalAbsent = 0;
        let totalRate = 0;
        
        scouts.forEach(scout => {
          const attendedCount = scout.ScoutAttendance.filter(
            a => a.attendanceStatus === 'attended'
          ).length;
          
          const absentCount = scout.ScoutAttendance.filter(
            a => a.attendanceStatus === 'absent'
          ).length;
          
          const totalDays = attendedCount + absentCount;
          const attendanceRate = totalDays > 0 ? (attendedCount / totalDays) * 100 : 0;
          
          totalAttended += attendedCount;
          totalAbsent += absentCount;
          totalRate += attendanceRate;
        });
        
        // Add scout statistics to summary
        summarySheet.addRow({ info: '', value: '' }); // Empty row
        summarySheet.addRow({ 
          info: 'إحصائيات الكشافة', 
          value: '' 
        });
        summarySheet.getRow(summarySheet.rowCount).font = { bold: true };
        
        summarySheet.addRow({ 
          info: 'عدد الكشافة', 
          value: scouts.length 
        });
        
        summarySheet.addRow({ 
          info: 'إجمالي الحضور', 
          value: totalAttended 
        });
        
        summarySheet.addRow({ 
          info: 'إجمالي الغياب', 
          value: totalAbsent 
        });
        
        summarySheet.addRow({ 
          info: 'متوسط نسبة الحضور', 
          value: scouts.length > 0 ? `${(totalRate / scouts.length).toFixed(1)}%` : '0%' 
        });
        
        // Create scouts worksheet
        const scoutsSheet = workbook.addWorksheet(`كشافة ${baseName} ${suffixName}`);
        
        // Add headers with all fields
        scoutsSheet.columns = [
          { header: 'الرقم', key: 'id', width: 10 },
          { header: 'الاسم', key: 'name', width: 30 },
          { header: 'رقم الهاتف', key: 'phoneNumber', width: 20 },
          { header: 'تاريخ الميلاد', key: 'birthDate', width: 15 },
          { header: 'العنوان', key: 'address', width: 30 },
          { header: 'عدد الحضور', key: 'attended', width: 15 },
          { header: 'عدد الغياب', key: 'absent', width: 15 },
          { header: 'نسبة الحضور', key: 'rate', width: 15 },
          { header: 'الحالة', key: 'status', width: 15 },
        ];
        
        // Add rows
        scouts.forEach((scout, index) => {
          const attendedCount = scout.ScoutAttendance.filter(
            a => a.attendanceStatus === 'attended'
          ).length;
          
          const absentCount = scout.ScoutAttendance.filter(
            a => a.attendanceStatus === 'absent'
          ).length;
          
          const totalDays = attendedCount + absentCount;
          const attendanceRate = totalDays > 0 ? (attendedCount / totalDays) * 100 : 0;
          
          let status = '';
          if (attendanceRate >= 75) status = 'ممتاز';
          else if (attendanceRate >= 50) status = 'جيد';
          else if (attendanceRate >= 25) status = 'تحذير';
          else status = 'خطر';
          
          scoutsSheet.addRow({
            id: index + 1,
            name: scout.name,
            phoneNumber: scout.phoneNumber || '',
            birthDate: scout.birthDate ? new Date(scout.birthDate).toLocaleDateString('ar-EG') : '',
            address: scout.address || '',
            attended: attendedCount,
            absent: absentCount,
            rate: `${attendanceRate.toFixed(1)}%`,
            status,
          });
          
          // Add conditional formatting for status
          const rowIndex = index + 2; // +2 because of header row
          const statusCell = scoutsSheet.getCell(`J${rowIndex}`);
          
          if (attendanceRate >= 75) {
            statusCell.font = { color: { argb: '31C48D' } }; // Green-400
          } else if (attendanceRate >= 50) {
            statusCell.font = { color: { argb: '16BDCA' } }; // Teal-400
          } else if (attendanceRate >= 25) {
            statusCell.font = { color: { argb: 'FACA15' } }; // Yellow-400
          } else {
            statusCell.font = { color: { argb: 'F05252' } }; // Red-400
          }
        });
        
        // Style the headers
        const headerRow = scoutsSheet.getRow(1);
        headerRow.font = { bold: true };
        headerRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '4B5563' }, // Grey-600
        };
        headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
        headerRow.alignment = { horizontal: 'right' };
        
        // Set RTL direction for the sheet
        scoutsSheet.views = [{ rightToLeft: true }];
      }
    }
    
    // Write to buffer
    const buffer = await workbook.xlsx.writeBuffer();
    
    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    
    const filename = type === 'all_sectors' 
      ? 'all_sectors_data.xlsx' 
      : `sector.xlsx`;
      
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    
    // Send the buffer
    res.send(buffer);
  }),
};

// Helper function to get role text in Arabic
function getCaptainRoleText(type: string): string {
  switch (type) {
    case 'general':
      return 'قائد عام';
    case 'unit':
      return 'قائد وحدة';
    case 'regular':
      return 'قائد';
    default:
      return type;
  }
}

export default reportController;