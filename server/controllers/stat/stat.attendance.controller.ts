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

  /* getAttendanceLineChart
   *
   * @desc gets the attendance line chart for all scouts
   * @endpoint GET /api/stat/attendance/line-chart
   */
  getAttendanceLineChart: async (req: Request, res: Response) => {
    try {
      const { sectorBaseName, sectorSuffixName, unitCaptainId } = req.query;

      if (req.currentWeek?.termNumber === 0) {
        return res.status(400).json({
          error: "Cannot get absence rate before the term starts",
        });
      }

      let filters = {};

      if (sectorBaseName && sectorSuffixName)
        filters = {
          Scout: {
            sectorBaseName: sectorBaseName as string,
            sectorSuffixName: sectorSuffixName as string,
          },
        };
      else if (unitCaptainId)
        filters = {
          Scout: {
            Sector: {
              unitCaptainId: parseInt(unitCaptainId as string),
            },
          },
        };

      let attendanceRates = [];

      for (let i = 1; i <= (req?.currentWeek?.weekNumber || 0); i++) {
        const absenceCount = await prisma.scoutAttendance.count({
          where: {
            termNumber: req.currentWeek?.termNumber,
            attendanceStatus: "absent",
            Week: {
              weekNumber: i,
              cancelled: false,
            },
            ...filters,
          },
        });

        const attendanceCount = await prisma.scoutAttendance.count({
          where: {
            termNumber: req.currentWeek?.termNumber,
            attendanceStatus: "attended",
            Week: {
              weekNumber: i,
              cancelled: false,
            },
            ...filters,
          },
        });

        const absenceRate = computeAttendanceRate({
          absence_count: absenceCount,
          attendance_count: attendanceCount,
        });

        attendanceRates.push({
          weekNumber: i,
          absenceRate: absenceRate ?? 0,
        });
      }

      return res.status(200).json({
        message: "Get absence rate successfully",
        body: attendanceRates,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "An error occurred while getting absence rate" });
    }
  },

  /* getAttendanceStackLineChart
   *
   * @desc gets line chart data for all sectors seprated
   * @endpoint GET /api/stat/attendance/stacked-line-chart
   */
  getAttendanceStackLineChart: async (req: Request, res: Response) => {
    try {
      if (req.currentWeek?.termNumber === 0) {
        return res.status(400).json({
          error: "Cannot get absence rate before the term starts",
        });
      }

      const sectors = await prisma.sector.findMany();

      let sectorGraphs: {
        sectorBaseName: string;
        sectorSuffixName: string;
        attendanceRates: any;
      }[] = new Array();

      for (let j = 0; j < sectors.length; ++j) {
        let attendanceRates = [];

        for (let i = 1; i <= (req?.currentWeek?.weekNumber || 0); i++) {
          const absenceCount = await prisma.scoutAttendance.count({
            where: {
              termNumber: req.currentWeek?.termNumber,
              attendanceStatus: "absent",
              Week: {
                weekNumber: i,
                cancelled: false,
              },
              Scout: {
                sectorBaseName: sectors[j].baseName,
                sectorSuffixName: sectors[j].suffixName,
              },
            },
          });

          const attendanceCount = await prisma.scoutAttendance.count({
            where: {
              termNumber: req.currentWeek?.termNumber,
              attendanceStatus: "attended",
              Week: {
                weekNumber: i,
                cancelled: false,
              },
              Scout: {
                sectorBaseName: sectors[j].baseName,
                sectorSuffixName: sectors[j].suffixName,
              },
            },
          });

          const absenceRate = computeAttendanceRate({
            absence_count: absenceCount,
            attendance_count: attendanceCount,
          });
          attendanceRates.push({
            weekNumber: i,
            absenceRate: absenceRate ?? 0,
          });
        }

        sectorGraphs.push({
          sectorBaseName: sectors[j].baseName,
          sectorSuffixName: sectors[j].suffixName,
          attendanceRates,
        });
      }

      console.log(sectorGraphs);

      return res.status(200).json({
        message: `Get stacked attendance graph succfully`,
        body: sectorGraphs,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "An error occurred while getting absence rate" });
    }
  },
};

export default statAttendanceController;
