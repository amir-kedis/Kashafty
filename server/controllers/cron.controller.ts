/*==================================================================================================
 *
 *
 *
 *     ██████╗██████╗  ██████╗ ███╗   ██╗
 *    ██╔════╝██╔══██╗██╔═══██╗████╗  ██║
 *    ██║     ██████╔╝██║   ██║██╔██╗ ██║
 *    ██║     ██╔══██╗██║   ██║██║╚██╗██║
 *    ╚██████╗██║  ██║╚██████╔╝██║ ╚████║██╗
 *     ╚═════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝
 *
 *
 *    handles all repeated requests.
 *
 *    Author: Amir Kedis
 *
 *==================================================================================================*/

import { Request, Response } from "express";
import { prisma } from "../database/db";
import { NotificationStatus, NotificationType } from "@prisma/client";
import asyncDec from "../utils/asyncDec";
import AppError from "../utils/AppError";

interface SectorGroup {
  sectorBaseName: string;
  sectorSuffixName: string;
  scouts: Array<{
    name: string;
    [key: string]: any;
  }>;
}

interface SectorGroups {
  [key: string]: SectorGroup;
}

const cronController = {
  createMissingWeeks: asyncDec(async (_req: Request, res: Response) => {
    const curTerm = await prisma.term.findFirst({
      orderBy: {
        termNumber: "desc",
      },
      include: {
        Week: true,
      },
    });

    if (!curTerm) {
      throw new AppError(404, "No current term found", "لم يتم العثور على فترة حالية");
    }

    const today = new Date();
    const startDate = new Date(curTerm.startDate);

    const totalWeeks = Math.ceil(
      (today.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000),
    );

    const existingWeeks = new Set(
      curTerm.Week.map((week) => week.weekNumber),
    );

    // Create missing weeks
    for (let i = 1; i <= totalWeeks; i++) {
      if (!existingWeeks.has(i)) {
        await prisma.week.create({
          data: {
            weekNumber: i,
            termNumber: curTerm.termNumber,
            startDate: new Date(
              startDate.getTime() + (i - 1) * 7 * 24 * 60 * 60 * 1000,
            ),
          },
        });
      }
    }

    return res.status(200).json({ 
      message: "Missing weeks created successfully",
      arabicMessage: "تم إنشاء الأسابيع المفقودة بنجاح"
    });
  }),

  sendScoutsAbsenceNotification: asyncDec(async (_req: Request, res: Response) => {
    // Get current term with weeks and attendance data
    const curTerm = await prisma.term.findFirst({
      orderBy: {
        termNumber: "desc",
      },
      include: {
        Week: {
          include: {
            ScoutAttendance: true,
          },
        },
      },
    });

    if (!curTerm) {
      throw new AppError(404, "No current term found", "لم يتم العثور على فترة حالية");
    }

    // Get current week number
    const today = new Date();
    const currentWeek = await prisma.week.findFirst({
      where: {
        termNumber: curTerm.termNumber,
        startDate: {
          lte: today,
        },
      },
      orderBy: {
        weekNumber: "desc",
      },
    });

    if (!currentWeek) {
      throw new AppError(404, "No current week found", "لم يتم العثور على أسبوع حالي");
    }

    // Get all scouts with their attendance records
    const attendanceRates = await prisma.scout.findMany({
      include: {
        ScoutAttendance: {
          where: {
            Week: {
              termNumber: curTerm.termNumber,
            },
          },
        },
        Sector: true,
      },
    });

    // Filter scouts with attendance rate below 50%
    const scoutsToNotify = attendanceRates.filter((scout) => {
      const totalDays = scout.ScoutAttendance.length;
      if (totalDays === 0) return false; // Skip scouts with no attendance records
      
      const totalAttendance = scout.ScoutAttendance.filter(
        (attendance) => attendance.attendanceStatus === "attended",
      ).length;
      const attendanceRate = totalAttendance / totalDays;

      return attendanceRate < 0.5;
    });

    // Group scouts by sector
    const scoutsBySector = scoutsToNotify.reduce<SectorGroups>((acc, scout) => {
      const sectorKey = `${scout.sectorBaseName}_${scout.sectorSuffixName}`;
      if (!acc[sectorKey]) {
        acc[sectorKey] = {
          sectorBaseName: scout.sectorBaseName,
          sectorSuffixName: scout.sectorSuffixName,
          scouts: [],
        };
      }
      acc[sectorKey].scouts.push(scout);
      return acc;
    }, {});

    // Get all general captains
    const generalCaptains = await prisma.captain.findMany({
      where: {
        type: "general",
      },
    });

    // For each sector, create and send notifications
    let totalNotificationsSent = 0;
    
    for (const sectorKey in scoutsBySector) {
      const sector = scoutsBySector[sectorKey];
      
      // Get sector captains
      const sectorCaptains = await prisma.captain.findMany({
        where: {
          type: "regular",
          rSectorBaseName: sector.sectorBaseName,
          rSectorSuffixName: sector.sectorSuffixName,
        },
      });

      // Get unit captain of the sector
      const unitCaptainOfSector = await prisma.sector.findFirst({
        where: {
          baseName: sector.sectorBaseName,
          suffixName: sector.sectorSuffixName,
        },
        include: {
          Captain_Sector_unitCaptainIdToCaptain: true,
        },
      });

      // Format scout names for the message
      const scoutNames = sector.scouts.map(scout => scout.name).join("، ");
      
      // Create notification message
      const title = `غياب كشافة قطاع ${sector.sectorBaseName} ${sector.sectorSuffixName}`;
      const message = `
        الأسبوع ${currentWeek.weekNumber} - الفترة ${curTerm.termNumber} (${curTerm.termName || ""})
        
        الكشافة التالية تخطى غيابهم الـ 50%:
        ${scoutNames}
        
        عدد الكشافة: ${sector.scouts.length}
      `;
      
      // Create notifications array
      const notifications = [];

      // Add notifications for general captains
      generalCaptains.forEach((captain) => {
        notifications.push({
          captainId: captain.captainId,
          title,
          message,
          type: NotificationType.attendance,
          status: NotificationStatus.UNREAD,
        });
      });

      // Add notifications for sector captains
      sectorCaptains.forEach((captain) => {
        notifications.push({
          captainId: captain.captainId,
          title,
          message,
          type: NotificationType.attendance,
          status: NotificationStatus.UNREAD,
        });
      });

      // Add notification for unit captain if exists
      if (unitCaptainOfSector?.unitCaptainId) {
        notifications.push({
          captainId: unitCaptainOfSector.unitCaptainId,
          title,
          message,
          type: NotificationType.attendance,
          status: NotificationStatus.UNREAD,
        });
      }

      // Create notifications in database
      if (notifications.length > 0) {
        const result = await prisma.notification.createMany({
          data: notifications,
        });
        totalNotificationsSent += result.count;
      }
    }

    return res.status(200).json({ 
      message: `Sent ${totalNotificationsSent} notifications for ${Object.keys(scoutsBySector).length} sectors`,
      arabicMessage: `تم إرسال ${totalNotificationsSent} إشعار لـ ${Object.keys(scoutsBySector).length} قطاع`
    });
  }),

  sendCaptainsAbsenceNotification: asyncDec(async (_req: Request, res: Response) => {
    // Get current term
    const curTerm = await prisma.term.findFirst({
      orderBy: {
        termNumber: "desc",
      },
      include: {
        Week: {
          include: {
            ScoutAttendance: true,
          },
        },
      },
    });

    if (!curTerm) {
      throw new AppError(404, "No current term found", "لم يتم العثور على فترة حالية");
    }

    // Get current week
    const today = new Date();
    const currentWeek = await prisma.week.findFirst({
      where: {
        termNumber: curTerm.termNumber,
        startDate: {
          lte: today,
        },
      },
      orderBy: {
        weekNumber: "desc",
      },
    });

    if (!currentWeek) {
      throw new AppError(404, "No current week found", "لم يتم العثور على أسبوع حالي");
    }

    // Get captains with attendance data
    const attendanceRates = await prisma.captain.findMany({
      include: {
        CaptainAttendance: {
          where: {
            Week: {
              termNumber: curTerm.termNumber,
            },
          },
        },
      },
    });

    // Filter captains with low attendance
    const captainsToNotify = attendanceRates.filter((captain) => {
      const totalDays = captain.CaptainAttendance.length;
      if (totalDays === 0) return false;
      
      const totalAttendance = captain.CaptainAttendance.filter(
        (attendance) => attendance.attendanceStatus === "attended",
      ).length;
      const attendanceRate = totalAttendance / totalDays;

      return attendanceRate < 0.5;
    });

    // Group captains by sector
    const captainsBySector = captainsToNotify.reduce<Record<string, any>>((acc, captain) => {
      if (!captain.rSectorBaseName || !captain.rSectorSuffixName) return acc;
      
      const sectorKey = `${captain.rSectorBaseName}_${captain.rSectorSuffixName}`;
      if (!acc[sectorKey]) {
        acc[sectorKey] = {
          sectorBaseName: captain.rSectorBaseName,
          sectorSuffixName: captain.rSectorSuffixName,
          captains: [],
        };
      }
      acc[sectorKey].captains.push(captain);
      return acc;
    }, {});

    // Get general captains
    const generalCaptains = await prisma.captain.findMany({
      where: {
        type: "general",
      },
    });

    // For each sector, create notifications
    let totalNotificationsSent = 0;
    
    for (const sectorKey in captainsBySector) {
      const sector = captainsBySector[sectorKey];
      
      // Get unit captain of the sector
      const unitCaptainOfSector = await prisma.sector.findFirst({
        where: {
          baseName: sector.sectorBaseName,
          suffixName: sector.sectorSuffixName,
        },
      });

      // Format captain names for the message
      const captainNames = sector.captains.map((captain: any) => 
        `${captain.firstName} ${captain.middleName}`
      ).join("، ");
      
      // Create notification message
      const title = `غياب قادة قطاع ${sector.sectorBaseName} ${sector.sectorSuffixName}`;
      const message = `
        الأسبوع ${currentWeek.weekNumber} - الفترة ${curTerm.termNumber} (${curTerm.termName || ""})
        
        القادة التالية تخطى غيابهم الـ 50%:
        ${captainNames}
        
        عدد القادة: ${sector.captains.length}
      `;
      
      // Create notifications array
      const notifications = [];

      // Add notifications for general captains
      generalCaptains.forEach((captain) => {
        notifications.push({
          captainId: captain.captainId,
          title,
          message,
          type: NotificationType.attendance,
          status: NotificationStatus.UNREAD,
        });
      });

      // Add notification for unit captain if exists
      if (unitCaptainOfSector?.unitCaptainId) {
        notifications.push({
          captainId: unitCaptainOfSector.unitCaptainId,
          title,
          message,
          type: NotificationType.attendance,
          status: NotificationStatus.UNREAD,
        });
      }

      // Create notifications in database
      if (notifications.length > 0) {
        const result = await prisma.notification.createMany({
          data: notifications,
        });
        totalNotificationsSent += result.count;
      }
    }

    // Handle captains without sectors
    const captainsWithoutSector = captainsToNotify.filter(
      captain => !captain.rSectorBaseName || !captain.rSectorSuffixName
    );
    
    if (captainsWithoutSector.length > 0) {
      const captainNames = captainsWithoutSector.map(captain => 
        `${captain.firstName} ${captain.middleName}`
      ).join("، ");
      
      const title = "غياب قادة بدون قطاع";
      const message = `
        الأسبوع ${currentWeek.weekNumber} - الفترة ${curTerm.termNumber} (${curTerm.termName || ""})
        
        القادة التالية تخطى غيابهم الـ 50%:
        ${captainNames}
        
        عدد القادة: ${captainsWithoutSector.length}
      `;
      
      const notifications = generalCaptains.map(captain => ({
        captainId: captain.captainId,
        title,
        message,
        type: NotificationType.attendance,
        status: NotificationStatus.UNREAD,
      }));
      
      if (notifications.length > 0) {
        const result = await prisma.notification.createMany({
          data: notifications,
        });
        totalNotificationsSent += result.count;
      }
    }

    return res.status(200).json({ 
      message: `Sent ${totalNotificationsSent} notifications for ${Object.keys(captainsBySector).length + (captainsWithoutSector?.length > 0 ? 1 : 0)} groups`,
      arabicMessage: `تم إرسال ${totalNotificationsSent} إشعار لـ ${Object.keys(captainsBySector).length + (captainsWithoutSector?.length > 0 ? 1 : 0)} مجموعة`
    });
  }),
};

export default cronController;
