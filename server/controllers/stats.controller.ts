import { Request, Response } from "express";
import { prisma } from "../database/db";
import { computeAttendanceRate } from "../utils/computeAbsenceRate";
import { AttendanceStatus } from "@prisma/client";

interface StatsRequest extends Request {
  currentWeek?: {
    termNumber: number;
    weekNumber: number;
  };
  currentTerm?: {
    termNumber: number;
  };
}

const statsController = {
  // @desc    Get absence rate for all scouts
  // @route   GET /api/stats/scout
  // @access  Private
  getAllScoutsAbsenceRate: async (req: StatsRequest, res: Response) => {
    try {
      if (req.currentWeek?.termNumber === 0) {
        return res.status(400).json({
          error: "Cannot get absence rate before the term starts",
        });
      }

      const absenceCount = await prisma.scoutAttendance.count({
        where: {
          termNumber: req.currentWeek?.termNumber,
          attendanceStatus: "absent",
          Week: {
            cancelled: false,
          },
        },
      });

      const attendanceCount = await prisma.scoutAttendance.count({
        where: {
          termNumber: req.currentWeek?.termNumber,
          attendanceStatus: "attended",
          Week: {
            cancelled: false,
          },
        },
      });

      const absenceData = {
        absence_count: absenceCount,
        attendance_count: attendanceCount,
      };

      const absenceRate = computeAttendanceRate(absenceData);

      if (absenceRate == null) {
        return res.status(400).json({
          error: "There are no attendance records",
        });
      }

      return res.status(200).json({
        message: "Get absence rate successfully",
        body: absenceRate,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: "An error occurred while getting absence rate" });
    }
  },

  getScoutsInUnitAbsenceRate: async (req: StatsRequest, res: Response) => {
    try {
      const { unitCaptainId: unitCaptainIdStr } = req.params;
      const unitCaptainId = parseInt(unitCaptainIdStr);

      if (req.currentWeek?.termNumber === 0) {
        return res.status(400).json({
          error: "Cannot get absence rate before the term starts",
        });
      }

      const absenceCount = await prisma.scoutAttendance.count({
        where: {
          termNumber: req.currentWeek?.termNumber,
          attendanceStatus: "absent",
          Week: {
            cancelled: false,
          },
          Scout: {
            Sector: {
              unitCaptainId,
            },
          },
        },
      });

      const attendanceCount = await prisma.scoutAttendance.count({
        where: {
          termNumber: req.currentWeek?.termNumber,
          attendanceStatus: "attended",
          Week: {
            cancelled: false,
          },
          Scout: {
            Sector: {
              unitCaptainId,
            },
          },
        },
      });

      const absenceData = {
        absence_count: absenceCount,
        attendance_count: attendanceCount,
      };

      const absenceRate = computeAttendanceRate(absenceData);

      if (absenceRate == null) {
        return res.status(400).json({
          error: "There are no attendance records for this unit",
        });
      }

      return res.status(200).json({
        message: "Get absence rate successfully",
        body: absenceRate,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: "An error occurred while getting absence rate" });
    }
  },

  /* getSectorsAbsenceRate
   *
   * @desc Get attendance rate for all scouts in a certain sector
   * @route GET /api/stats/scouts/sector
   * @access private
   */
  getScoutsInSectorAbsenceRate: async (req: StatsRequest, res: Response) => {
    try {
      const { sectorBaseName, sectorSuffixName } = req.params;

      if (req.currentWeek?.termNumber === 0) {
        return res.status(400).json({
          error: "Cannot get absence rate before the term starts",
        });
      }

      const absenceCount = await prisma.scoutAttendance.count({
        where: {
          termNumber: req.currentWeek?.termNumber,
          attendanceStatus: AttendanceStatus.absent,
          Week: {
            cancelled: false,
          },
          Scout: {
            Sector: {
              baseName: sectorBaseName,
              suffixName: sectorSuffixName,
            },
          },
        },
      });

      const attendanceCount = await prisma.scoutAttendance.count({
        where: {
          termNumber: req.currentWeek?.termNumber,
          attendanceStatus: AttendanceStatus.attended,
          Week: {
            cancelled: false,
          },
          Scout: {
            Sector: {
              baseName: sectorBaseName,
              suffixName: sectorSuffixName,
            },
          },
        },
      });

      const absenceData = {
        absence_count: absenceCount,
        attendance_count: attendanceCount,
      };

      const absenceRate = computeAttendanceRate(absenceData);

      if (absenceRate == null) {
        return res.status(400).json({
          error: "There are no attendance records for this sector",
        });
      }

      return res.status(200).json({
        message: "Get absence rate successfully",
        body: absenceRate,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: "An error occurred while getting absence rate" });
    }
  },

  // @desc    Get absence rate for a scout
  // @route   GET /api/stats/scout/:scoutId
  // @access  Private
  getScoutAbsenceRate: async (req: StatsRequest, res: Response) => {
    try {
      const { scoutId: scoutIdStr } = req.params;
      const scoutId = parseInt(scoutIdStr);

      if (req.currentWeek?.termNumber === 0) {
        return res.status(400).json({
          error: "Cannot get absence rate before the term starts",
        });
      }

      const absentCount = await prisma.scoutAttendance.count({
        where: {
          scoutId,
          termNumber: req.currentWeek?.termNumber,
          attendanceStatus: AttendanceStatus.absent,
          Week: {
            cancelled: false,
          },
        },
      });

      const attendanceCount = await prisma.scoutAttendance.count({
        where: {
          scoutId,
          termNumber: req.currentWeek?.termNumber,
          attendanceStatus: AttendanceStatus.attended,
          Week: {
            cancelled: false,
          },
        },
      });

      const absenceData = {
        absence_count: absentCount,
        attendance_count: attendanceCount,
      };

      const absenceRate = computeAttendanceRate(absenceData);
      if (absenceRate == null) {
        return res.status(400).json({
          error: "There are no attendance records for this scout",
        });
      }

      return res.status(200).json({
        message: "Get absence rate successfully",
        body: absenceRate,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: "An error occurred while getting absence rate" });
    }
  },

  // @desc    Get absence rate for all scouts over weeks
  // @route   GET /api/stats/scout/all/graph
  // @access  Private
  getAllScoutsAbsenceRateGraph: async (req: StatsRequest, res: Response) => {
    try {
      if (req.currentWeek?.termNumber === 0) {
        return res.status(400).json({
          error: "Cannot get absence rate before the term starts",
        });
      }

      let absenceRates = [];

      for (let i = 1; i <= (req?.currentWeek?.weekNumber || 0); i++) {
        const absenceCount = await prisma.scoutAttendance.count({
          where: {
            termNumber: req.currentWeek?.termNumber,
            attendanceStatus: "absent",
            Week: {
              weekNumber: i,
              cancelled: false,
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
          },
        });

        const absenceRate = computeAttendanceRate({
          absence_count: absenceCount,
          attendance_count: attendanceCount,
        });

        absenceRates.push({
          weekNumber: i,
          absenceRate: absenceRate ?? 0, // Default to 0 if absenceRate is null
        });
      }

      return res.status(200).json({
        message: "Get absence rate successfully",
        body: absenceRates,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: "An error occurred while getting absence rate" });
    }
  },

  // @desc    Get absence rate for scouts in a unit over weeks
  // @route   GET /api/stats/scout/unit/:unitCaptainId/graph
  // @access  Private
  getScoutsInUnitAbsenceRateGraph: async (req: StatsRequest, res: Response) => {
    try {
      const { unitCaptainId: unitCaptainIdStr } = req.params;
      const unitCaptainId = parseInt(unitCaptainIdStr);

      if (req?.currentWeek?.termNumber === 0) {
        return res.status(400).json({
          error: "Cannot get absence rate before the term starts",
        });
      }

      let absenceRates = [];

      for (let i = 1; i <= (req.currentWeek?.weekNumber || 0); i++) {
        const absenceCount = await prisma.scoutAttendance.count({
          where: {
            termNumber: req.currentWeek?.termNumber,
            attendanceStatus: "absent",
            Week: {
              weekNumber: i,
              cancelled: false,
            },
            Scout: {
              Sector: {
                unitCaptainId,
              },
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
              Sector: {
                unitCaptainId,
              },
            },
          },
        });

        const absenceRate = computeAttendanceRate({
          absence_count: absenceCount,
          attendance_count: attendanceCount,
        });

        absenceRates.push({
          weekNumber: i,
          absenceRate: absenceRate ?? 0, // Default to 0 if absenceRate is null
        });
      }

      return res.status(200).json({
        message: "Get absence rate successfully",
        body: absenceRates,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: "An error occurred while getting absence rate" });
    }
  },

  // @desc    Get absence rate for scouts in a sector over weeks
  // @route   GET /api/stats/scout/:sectorBaseName/:sectorSuffixName/graph
  // @access  Private
  getScoutsInSectorAbsenceRateGraph: async (
    req: StatsRequest,
    res: Response,
  ) => {
    try {
      const { sectorBaseName, sectorSuffixName } = req.params;

      if (req?.currentWeek?.termNumber === 0) {
        return res.status(400).json({
          error: "Cannot get absence rate before the term starts",
        });
      }

      let absenceRates = [];

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
              Sector: {
                baseName: sectorBaseName,
                suffixName: sectorSuffixName,
              },
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
              Sector: {
                baseName: sectorBaseName,
                suffixName: sectorSuffixName,
              },
            },
          },
        });

        const absenceRate = computeAttendanceRate({
          absence_count: absenceCount,
          attendance_count: attendanceCount,
        });

        absenceRates.push({
          weekNumber: i,
          absenceRate: absenceRate ?? 0, // Default to 0 if absenceRate is null
        });
      }

      return res.status(200).json({
        message: "Get absence rate successfully",
        body: absenceRates,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: "An error occurred while getting absence rate" });
    }
  },
};

export default statsController;
