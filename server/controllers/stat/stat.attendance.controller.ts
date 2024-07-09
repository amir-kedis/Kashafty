/*==================================================================================================
 *
 *
 *    ███████╗████████╗ █████╗ ████████╗     █████╗ ████████╗████████╗███████╗███╗   ██╗██████╗
 *    ██╔════╝╚══██╔══╝██╔══██╗╚══██╔══╝    ██╔══██╗╚══██╔══╝╚══██╔══╝██╔════╝████╗  ██║██╔══██╗
 *    ███████╗   ██║   ███████║   ██║       ███████║   ██║      ██║   █████╗  ██╔██╗ ██║██║  ██║
 *    ╚════██║   ██║   ██╔══██║   ██║       ██╔══██║   ██║      ██║   ██╔══╝  ██║╚██╗██║██║  ██║
 *    ███████║   ██║   ██║  ██║   ██║██╗    ██║  ██║   ██║      ██║   ███████╗██║ ╚████║██████╔╝██╗
 *    ╚══════╝   ╚═╝   ╚═╝  ╚═╝   ╚═╝╚═╝    ╚═╝  ╚═╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═══╝╚═════╝ ╚═╝
 *
 *    Stat Attendance controller
 *    handles all statistics related to attendance
 *
 *    Author: Amir Kedis
 *
 *==================================================================================================*/

import { Request, Response } from "express";
import { prisma } from "../../database/db";
import { computeAttendanceRate } from "../../utils/computeAbsenceRate";

const statAttendanceController = {
  /* getAttendanceRate
   *
   * @desc gets the attendance rate for a sector, unit, or all
   * @endpoint GET /api/stat/attendance/rate
   */
  getAttendanceRate: async (req: Request, res: Response) => {
    try {
      const { sectorBaseName, sectorSuffixName, unitCaptainId } = req.query;

      if (!req.currentTerm) {
        return res.status(400).json({ message: "Can't get the current term" });
      }

      let requestType: "all" | "sector" | "unit";

      if (sectorBaseName && sectorSuffixName) requestType = "sector";
      else if (unitCaptainId) requestType = "unit";
      else requestType = "all";

      let attendanceRate: number | null;
      let absenceCount: number | null;
      let attendanceCount: number | null;

      switch (requestType) {
        case "all":
          absenceCount = await prisma.scoutAttendance.count({
            where: {
              termNumber: req.currentWeek?.termNumber,
              attendanceStatus: "absent",
              Week: {
                cancelled: false,
              },
            },
          });

          attendanceCount = await prisma.scoutAttendance.count({
            where: {
              termNumber: req.currentWeek?.termNumber,
              attendanceStatus: "attended",
              Week: {
                cancelled: false,
              },
            },
          });

          attendanceRate = computeAttendanceRate({
            attendance_count: attendanceCount,
            absence_count: absenceCount,
          });

          break;
        case "sector":
          absenceCount = await prisma.scoutAttendance.count({
            where: {
              termNumber: req.currentWeek?.termNumber,
              attendanceStatus: "absent",
              Week: {
                cancelled: false,
              },
              Scout: {
                sectorBaseName: (sectorBaseName as string) || undefined,
                sectorSuffixName: (sectorSuffixName as string) || undefined,
              },
            },
          });

          attendanceCount = await prisma.scoutAttendance.count({
            where: {
              termNumber: req.currentWeek?.termNumber,
              attendanceStatus: "attended",
              Week: {
                cancelled: false,
              },
              Scout: {
                sectorBaseName: (sectorBaseName as string) || undefined,
                sectorSuffixName: (sectorSuffixName as string) || undefined,
              },
            },
          });

          attendanceRate = computeAttendanceRate({
            attendance_count: attendanceCount,
            absence_count: absenceCount,
          });
          break;
        case "unit":
          absenceCount = await prisma.scoutAttendance.count({
            where: {
              termNumber: req.currentWeek?.termNumber,
              attendanceStatus: "absent",
              Week: {
                cancelled: false,
              },
              Scout: {
                Sector: {
                  unitCaptainId: parseInt(unitCaptainId as string),
                },
              },
            },
          });

          attendanceCount = await prisma.scoutAttendance.count({
            where: {
              termNumber: req.currentWeek?.termNumber,
              attendanceStatus: "attended",
              Week: {
                cancelled: false,
              },
              Scout: {
                Sector: {
                  unitCaptainId: parseInt(unitCaptainId as string),
                },
              },
            },
          });

          attendanceRate = computeAttendanceRate({
            attendance_count: attendanceCount,
            absence_count: absenceCount,
          });
          break;
      }

      return res.status(200).json({
        message: `Get attendance rate for ${requestType} successfully`,
        body: attendanceRate,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default statAttendanceController;
