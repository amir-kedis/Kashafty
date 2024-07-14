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
import {
  Notification,
  NotificationStatus,
  NotificationType,
} from "@prisma/client";

const cronController = {
  createMissingWeeks: async (req: Request, res: Response) => {
    try {
      const curTerm = await prisma.term.findFirst({
        orderBy: {
          termNumber: "desc",
        },
        include: {
          Week: true,
        },
      });

      if (!curTerm) {
        return res.status(404).json({ message: "No current term found" });
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

      res.status(200).json({ message: "Missing weeks created successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  sendScoutsAbsenceNotification: async (req: Request, res: Response) => {
    try {
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
        return res.status(404).json({ message: "No current term found" });
      }

      const today = new Date();
      const startDate = new Date(curTerm.startDate);
      const totalWeeks = Math.ceil(
        (today.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000),
      );

      const attendanceRates = await prisma.scout.findMany({
        include: {
          ScoutAttendance: {
            where: {
              Week: {
                termNumber: curTerm.termNumber,
              },
            },
          },
          Sector: {
            include: {},
          },
        },
      });

      const scoutsToNotify = attendanceRates.filter((scout) => {
        const totalDays = scout.ScoutAttendance.length;
        const totalAttendance = scout.ScoutAttendance.filter(
          (attendance) => attendance.attendanceStatus === "attended",
        ).length;
        const attendanceRate = totalAttendance / totalDays;

        return attendanceRate < 0.5;
      });

      const generalCaptains = await prisma.captain.findMany({
        where: {
          type: "general",
        },
      });

      for (const scout of scoutsToNotify) {
        const sectorCaptains = await prisma.captain.findMany({
          where: {
            type: "regular",
            rSectorBaseName: scout.sectorBaseName,
            rSectorSuffixName: scout.sectorSuffixName,
          },
        });

        const unitCaptinOfSector = await prisma.sector.findFirst({
          where: {
            baseName: scout.sectorBaseName as string,
            suffixName: scout.sectorSuffixName as string,
          },
        });

        const notifications = [];

        generalCaptains.forEach((captain) => {
          notifications.push({
            captainId: captain.captainId,
            title: "غياب كشاف",
            message: `الكشاف ${scout.firstName} ${scout.middleName} تخطى غيابه الـ 50%`,
            type: NotificationType.attendance,
            status: NotificationStatus.UNREAD,
          });
        });

        sectorCaptains.forEach((captain) => {
          notifications.push({
            captainId: captain.captainId,
            title: "غياب كشاف",
            message: `الكشاف ${scout.firstName} ${scout.middleName} تخطى غيابه الـ 50%`,
            type: NotificationType.attendance,
            status: NotificationStatus.UNREAD,
          });
        });

        if (unitCaptinOfSector?.unitCaptainId)
          notifications.push({
            captainId: unitCaptinOfSector?.unitCaptainId,
            title: "غياب كشاف",
            message: `الكشاف ${scout.firstName} ${scout.middleName} تخطى غيابه الـ 50%`,
            type: NotificationType.attendance,
            status: NotificationStatus.UNREAD,
          });

        await prisma.notification.createMany({
          data: notifications,
        });
      }

      res
        .status(200)
        .json({ message: "send notifications for " + scoutsToNotify.length });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  sendCaptainsAbsenceNotification: async (req: Request, res: Response) => {
    try {
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
        return res.status(404).json({ message: "No current term found" });
      }

      const today = new Date();
      const startDate = new Date(curTerm.startDate);
      const totalWeeks = Math.ceil(
        (today.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000),
      );

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

      const captainsToNotify = attendanceRates.filter((scout) => {
        const totalDays = scout.CaptainAttendance.length;
        const totalAttendance = scout.CaptainAttendance.filter(
          (attendance) => attendance.attendanceStatus === "attended",
        ).length;
        const attendanceRate = totalAttendance / totalDays;

        return attendanceRate < 0.5;
      });

      const generalCaptains = await prisma.captain.findMany({
        where: {
          type: "general",
        },
      });

      for (const captain of captainsToNotify) {
        const unitCaptinOfSector = await prisma.sector.findFirst({
          where: {
            baseName: captain.rSectorBaseName as string,
            suffixName: captain.rSectorSuffixName as string,
          },
        });

        const notifications = [];

        generalCaptains.forEach((captain) => {
          notifications.push({
            captainId: captain.captainId,
            title: "غياب كشاف",
            message: `الكشاف ${captain.firstName} ${captain.middleName} تخطى غيابه الـ 50%`,
            type: NotificationType.attendance,
            status: NotificationStatus.UNREAD,
          });
        });

        if (unitCaptinOfSector?.unitCaptainId)
          notifications.push({
            captainId: unitCaptinOfSector?.unitCaptainId,
            title: "غياب كشاف",
            message: `القائد/ة ${captain.firstName} ${captain.middleName} تخطى غيابه الـ 50%`,
            type: NotificationType.attendance,
            status: NotificationStatus.UNREAD,
          });

        await prisma.notification.createMany({
          data: notifications,
        });
      }

      res
        .status(200)
        .json({ message: "send notifications for " + captainsToNotify.length });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default cronController;
