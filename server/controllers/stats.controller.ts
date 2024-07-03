import { Request, Response } from "express";
import db from "../database/db";
import { computeAttendanceRate } from "../utils/computeAbsenceRate";

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

      const result = await db.query(
        `SELECT 
          COUNT(*) FILTER (WHERE "attendanceStatus" = 'absent') AS absence_count,
          COUNT(*) FILTER (WHERE "attendanceStatus" = 'attended') AS attendance_count
          FROM "ScoutAttendance" AS S
          INNER JOIN "Week" AS W ON S."weekNumber" = W."weekNumber" AND S."termNumber" = W."termNumber"
          WHERE
          W."cancelled" = false AND
          S."termNumber" = $1;`,
        [req.currentWeek?.termNumber],
      );

      const absenceRate = computeAttendanceRate(result.rows[0]);
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

  // @desc    Get absence rate for scouts in a unit
  // @route   GET /api/stats/scout/unit/:unitCaptainId
  // @access  Private
  getScoutsInUnitAbsenceRate: async (req: StatsRequest, res: Response) => {
    try {
      const { unitCaptainId } = req.params;

      if (req.currentWeek?.termNumber === 0) {
        return res.status(400).json({
          error: "Cannot get absence rate before the term starts",
        });
      }

      const result = await db.query(
        `SELECT 
          COUNT(*) FILTER (WHERE "attendanceStatus" = 'absent') AS absence_count,
          COUNT(*) FILTER (WHERE "attendanceStatus" = 'attended') AS attendance_count 
          FROM "ScoutAttendance" AS SA
          INNER JOIN "Scout" AS SC ON SA."scoutId" = SC."scoutId"
          INNER JOIN "Sector" AS SE ON SC."sectorBaseName" = SE."baseName" AND SC."sectorSuffixName" = SE."suffixName"
          INNER JOIN "Week" AS W ON SA."weekNumber" = W."weekNumber" AND SA."termNumber" = W."termNumber"
          WHERE
          W."cancelled" = false AND
          SA."termNumber" = $1 AND
          SE."unitCaptainId" = $2;`,
        [req.currentWeek?.termNumber, unitCaptainId],
      );

      const absenceRate = computeAttendanceRate(result.rows[0]);
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

  // @desc    Get absence rate for scouts in a sector
  // @route   GET /api/stats/scout/:sectorBaseName/:sectorSuffixName
  // @access  Private
  getScoutsInSectorAbsenceRate: async (req: StatsRequest, res: Response) => {
    try {
      const { sectorBaseName, sectorSuffixName } = req.params;

      if (req.currentWeek?.termNumber === 0) {
        return res.status(400).json({
          error: "Cannot get absence rate before the term starts",
        });
      }

      const result = await db.query(
        `SELECT 
          COUNT(*) FILTER (WHERE "attendanceStatus" = 'absent') AS absence_count,
          COUNT(*) FILTER (WHERE "attendanceStatus" = 'attended') AS attendance_count 
          FROM "ScoutAttendance" AS SA
          INNER JOIN "Scout" AS SC ON SA."scoutId" = SC."scoutId"
          INNER JOIN "Week" AS W ON SA."weekNumber" = W."weekNumber" AND SA."termNumber" = W."termNumber"
          WHERE
          W."cancelled" = false AND
          SA."termNumber" = $1 AND
          SC."sectorBaseName" = $2 AND
          SC."sectorSuffixName" = $3;`,
        [req.currentWeek?.termNumber, sectorBaseName, sectorSuffixName],
      );

      const absenceRate = computeAttendanceRate(result.rows[0]);
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
      const { scoutId } = req.params;

      if (req.currentWeek?.termNumber === 0) {
        return res.status(400).json({
          error: "Cannot get absence rate before the term starts",
        });
      }

      const result = await db.query(
        `SELECT 
          COUNT(*) FILTER (WHERE "attendanceStatus" = 'absent') AS absence_count,
          COUNT(*) FILTER (WHERE "attendanceStatus" = 'attended') AS attendance_count 
          FROM "ScoutAttendance" AS SA
          INNER JOIN "Scout" AS SC ON SA."scoutId" = SC."scoutId"
          INNER JOIN "Week" AS W ON SA."weekNumber" = W."weekNumber" AND SA."termNumber" = W."termNumber"
          WHERE
          W."cancelled" = false AND
          SA."scoutId" = $1 AND
          SA."termNumber" = $2;`,
        [scoutId, req.currentTerm?.termNumber],
      );

      const absenceRate = computeAttendanceRate(result.rows[0]);
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
        const result = await db.query(
          `SELECT 
            COUNT(*) FILTER (WHERE "attendanceStatus" = 'absent') AS absence_count,
            COUNT(*) FILTER (WHERE "attendanceStatus" = 'attended') AS attendance_count
            FROM "ScoutAttendance" AS S
            INNER JOIN "Week" AS W ON S."weekNumber" = W."weekNumber" AND S."termNumber" = W."termNumber"
            WHERE
            W."cancelled" = false AND
            W."weekNumber" = $1 AND
            S."termNumber" = $2;`,
          [i, req?.currentWeek?.termNumber],
        );

        const absenceRate = computeAttendanceRate(result.rows[0]);
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
      const { unitCaptainId } = req.params;

      if (req?.currentWeek?.termNumber === 0) {
        return res.status(400).json({
          error: "Cannot get absence rate before the term starts",
        });
      }

      let absenceRates = [];

      for (let i = 1; i <= (req.currentWeek?.weekNumber || 0); i++) {
        const result = await db.query(
          `SELECT 
            COUNT(*) FILTER (WHERE "attendanceStatus" = 'absent') AS absence_count,
            COUNT(*) FILTER (WHERE "attendanceStatus" = 'attended') AS attendance_count
            FROM "ScoutAttendance" AS SA
            INNER JOIN "Scout" AS SC ON SA."scoutId" = SC."scoutId"
            INNER JOIN "Sector" AS SE ON SC."sectorBaseName" = SE."baseName" AND SC."sectorSuffixName" = SE."suffixName"
            INNER JOIN "Week" AS W ON SA."weekNumber" = W."weekNumber" AND SA."termNumber" = W."termNumber"
            WHERE
            W."cancelled" = false AND
            SE."unitCaptainId" = $1 AND
            W."weekNumber" = $2 AND
            SA."termNumber" = $3;`,
          [unitCaptainId, i, req?.currentWeek?.termNumber],
        );

        const absenceRate = computeAttendanceRate(result.rows[0]);
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
        const result = await db.query(
          `SELECT 
            COUNT(*) FILTER (WHERE "attendanceStatus" = 'absent') AS absence_count,
            COUNT(*) FILTER (WHERE "attendanceStatus" = 'attended') AS attendance_count
            FROM "ScoutAttendance" AS SA
            INNER JOIN "Scout" AS SC ON SA."scoutId" = SC."scoutId"
            INNER JOIN "Week" AS W ON SA."weekNumber" = W."weekNumber" AND SA."termNumber" = W."termNumber"
            WHERE
            W."cancelled" = false AND
            SC."sectorBaseName" = $1 AND
            SC."sectorSuffixName" = $2 AND
            W."weekNumber" = $3 AND
            SA."termNumber" = $4;`,
          [sectorBaseName, sectorSuffixName, i, req?.currentWeek?.termNumber],
        );

        const absenceRate = computeAttendanceRate(result.rows[0]);
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
