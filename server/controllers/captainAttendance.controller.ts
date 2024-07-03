import { Request, Response } from "express";
import db from "../database/db";

interface UpsertAttendanceRequest extends Request {
  body: {
    attendanceRecords: {
      captainId: string;
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

interface GetCaptainAttendanceRequest extends Request {
  params: {
    captainId: string;
    weekNumber: string;
    termNumber: string;
  };
}

interface GetUnitAttendanceRequest extends Request {
  query: {
    unitCaptainId: string;
    weekNumber: string;
    termNumber: string;
  };
}

const captainAttendanceController = {
  upsertAttendance: async (
    req: UpsertAttendanceRequest,
    res: Response,
  ): Promise<any> => {
    try {
      const { attendanceRecords } = req.body;

      if (attendanceRecords.length === 0) {
        return res.status(404).json({
          error: "No records were found",
        });
      }

      let result = [];

      for (let i = 0; i < attendanceRecords.length; i++) {
        const queryResult = await db.query(
          `
          INSERT INTO "CaptainAttendance" ("captainId", "weekNumber", "termNumber", "attendanceStatus")
          VALUES ($1, $2, $3, $4)
          ON CONFLICT ("captainId", "weekNumber", "termNumber")
          DO UPDATE SET "attendanceStatus" = EXCLUDED."attendanceStatus"
          RETURNING *;
          `,
          [
            attendanceRecords[i].captainId,
            attendanceRecords[i].weekNumber,
            attendanceRecords[i].termNumber,
            attendanceRecords[i].attendanceStatus,
          ],
        );

        result.push(queryResult.rows[0]);
      }

      res.status(200).json({
        message: "Successful insertion/update",
        body: result,
        count: result.length,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "An error occurred while inserting/updating captain Attendance",
        body: error,
      });
    }
  },

  getSectorAttendance: async (
    req: GetSectorAttendanceRequest,
    res: Response,
  ): Promise<any> => {
    try {
      const { baseName, suffixName, weekNumber, termNumber } = req.query;

      const result = await db.query(
        `
        SELECT "Captain".*, "CaptainAttendance".*
        FROM "Captain"
        LEFT JOIN "CaptainAttendance"
        ON "Captain"."captainId" = "CaptainAttendance"."captainId"
        AND "CaptainAttendance"."weekNumber" = $3 AND "CaptainAttendance"."termNumber" = $4
        INNER JOIN "Sector"
        ON "Sector"."baseName" = "Captain"."rSectorBaseName" AND "Sector"."suffixName" = "Captain"."rSectorSuffixName"
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
      console.error(error);
      res.status(500).json({
        error: "An error occurred while retrieving captain Attendance",
        body: error,
      });
    }
  },

  getCaptainAttendance: async (
    req: GetCaptainAttendanceRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const { captainId, weekNumber, termNumber } = req.params;

      const result = await db.query(
        `
        SELECT *
        FROM "CaptainAttendance"
        WHERE "captainId" = $1 AND "weekNumber" = $2 AND "termNumber" = $3
        `,
        [captainId, weekNumber, termNumber],
      );

      res.status(200).json({
        message: "Successful retrieval",
        body: result.rows,
        count: result.rowCount,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "An error occurred while retrieving captain Attendance",
        body: error,
      });
    }
  },

  getUnitAttendance: async (
    req: GetUnitAttendanceRequest,
    res: Response,
  ): Promise<any> => {
    try {
      const { unitCaptainId, weekNumber, termNumber } = req.query;

      const result = await db.query(
        `
        SELECT "Captain".*, "CaptainAttendance".*
        FROM "Captain"
        LEFT JOIN "CaptainAttendance"
        ON "Captain"."captainId" = "CaptainAttendance"."captainId"
        AND "CaptainAttendance"."weekNumber" = $2 AND "CaptainAttendance"."termNumber" = $3
        INNER JOIN "Sector"
        ON "Sector"."baseName" = "Captain"."rSectorBaseName" AND "Sector"."suffixName" = "Captain"."rSectorSuffixName"
        WHERE "Sector"."unitCaptainId" = $1;
        `,
        [unitCaptainId, weekNumber, termNumber],
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
      console.error(error);
      res.status(500).json({
        error: "An error occurred while retrieving unit Attendance",
        body: error,
      });
    }
  },
};

export default captainAttendanceController;
