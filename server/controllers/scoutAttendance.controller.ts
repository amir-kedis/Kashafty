import { Request, Response } from "express";
import db from "../database/db";

interface UpsertAttendanceRequest extends Request {
  body: {
    attendanceRecords: {
      scoutId: string;
      weekNumber: number;
      termNumber: number;
      attendanceStatus: string;
    }[];
  };
}

interface GetSectorAttendanceRequest extends Request {
  query: {
    baseName: string;
    suffixName: string;
    weekNumber: string;
    termNumber: string;
  };
}

interface GetScoutAttendanceRequest extends Request {
  params: {
    scoutId: string;
    weekNumber: string;
    termNumber: string;
  };
}

const scoutAttendanceController = {
  // @desc    Insert a new attendance record for a scout in a certain sector
  // @route   POST /api/sectorAttendance/
  // @access  Private
  upsertAttendance: async (req: UpsertAttendanceRequest, res: Response) => {
    try {
      const { attendanceRecords } = req.body;

      if (!attendanceRecords || attendanceRecords.length === 0) {
        return res.status(404).json({
          error: "No records were found",
        });
      }

      let result = [];

      for (let i = 0; i < attendanceRecords.length; i++) {
        const queryResult = await db.query(
          `
          INSERT INTO "ScoutAttendance" ("scoutId", "weekNumber", "termNumber", "attendanceStatus")
          VALUES ($1, $2, $3, $4)
          ON CONFLICT ("scoutId", "weekNumber", "termNumber")
          DO UPDATE SET "attendanceStatus" = EXCLUDED."attendanceStatus"
          RETURNING *;
        `,
          [
            attendanceRecords[i].scoutId,
            attendanceRecords[i].weekNumber,
            attendanceRecords[i].termNumber,
            attendanceRecords[i].attendanceStatus,
          ],
        );

        result.push(queryResult.rows[0]);
      }

      res.status(200).json({
        message: "Successful insertion",
        body: result,
        count: result.length,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "An error occurred while inserting a new attendance",
        body: error,
      });
    }
  },

  // @desc    Get all attendance records for all the scouts in a certain sector in a certain week & term
  // @route   GET /api/sectorAttendance/sector/all
  // @access  Private
  getSectorAttendance: async (
    req: GetSectorAttendanceRequest,
    res: Response,
  ) => {
    try {
      const { baseName, suffixName, weekNumber, termNumber } = req.query;

      const result = await db.query(
        `
        SELECT "Scout".*, "ScoutAttendance".* FROM "Scout"
        LEFT JOIN "ScoutAttendance" ON "Scout"."scoutId" = "ScoutAttendance"."scoutId"
        AND "ScoutAttendance"."weekNumber" = $3 AND "ScoutAttendance"."termNumber" = $4
        INNER JOIN "Sector" ON "Sector"."baseName" = "Scout"."sectorBaseName"
        AND "Sector"."suffixName" = "Scout"."sectorSuffixName"
        WHERE "Sector"."baseName" = $1 AND "Sector"."suffixName" = $2;
      `,
        [baseName, suffixName, weekNumber, termNumber],
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          error: "No data exists for the provided info",
        });
      }

      res.status(200).json({
        message: "Successful retrieval",
        body: result.rows,
        count: result.rowCount,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "An error occurred while retrieving sector attendance",
        body: error,
      });
    }
  },

  // @desc    Get attendance records for a certain scout in a certain week & term
  // @route   GET /api/sectorAttendance/:scoutId/:weekNumber/:termNumber
  // @access  Private
  getScoutAttendance: async (req: GetScoutAttendanceRequest, res: Response) => {
    try {
      const { scoutId, weekNumber, termNumber } = req.params;

      const result = await db.query(
        `
        SELECT *
        FROM "ScoutAttendance"
        WHERE "scoutId" = $1 AND "weekNumber" = $2 AND "termNumber" = $3
      `,
        [scoutId, weekNumber, termNumber],
      );

      res.status(200).json({
        message: "Successful retrieval",
        body: result.rows,
        count: result.rowCount,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "An error occurred while retrieving sector attendance",
        body: error,
      });
    }
  },
};

export default scoutAttendanceController;
