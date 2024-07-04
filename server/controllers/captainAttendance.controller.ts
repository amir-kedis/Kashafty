import { Request, Response } from "express";
import { prisma } from "../database/db";

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
        const queryResult = await prisma.captainAttendance.upsert({
          where: {
            captainId_weekNumber_termNumber: {
              captainId: parseInt(attendanceRecords[i].captainId),
              weekNumber: attendanceRecords[i].weekNumber,
              termNumber: attendanceRecords[i].termNumber,
            },
          },
          update: {
            attendanceStatus: attendanceRecords[i].attendanceStatus as any,
          },
          create: {
            captainId: parseInt(attendanceRecords[i].captainId),
            weekNumber: attendanceRecords[i].weekNumber,
            termNumber: attendanceRecords[i].termNumber,
            attendanceStatus: attendanceRecords[i].attendanceStatus as any,
          },
        });

        result.push(queryResult);
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

      // NOTE: left as reference delete after testing
      // const result = await db.query(
      //   `
      //   SELECT "Captain".*, "CaptainAttendance".*
      //   FROM "Captain"
      //   LEFT JOIN "CaptainAttendance"
      //   ON "Captain"."captainId" = "CaptainAttendance"."captainId"
      //   AND "CaptainAttendance"."weekNumber" = $3 AND "CaptainAttendance"."termNumber" = $4
      //   INNER JOIN "Sector"
      //   ON "Sector"."baseName" = "Captain"."rSectorBaseName" AND "Sector"."suffixName" = "Captain"."rSectorSuffixName"
      //   WHERE "Sector"."baseName" = $1 AND "Sector"."suffixName" = $2;
      //   `,
      //   [baseName, suffixName, weekNumber, termNumber],
      // );

      // TODO: needs testing
      const result = await prisma.captain.findMany({
        where: {
          rSectorBaseName: baseName,
          rSectorSuffixName: suffixName,
          CaptainAttendance: {
            some: {
              weekNumber: parseInt(weekNumber),
              termNumber: parseInt(termNumber),
            },
          },
        },
        include: {
          CaptainAttendance: {
            where: {
              weekNumber: parseInt(weekNumber),
              termNumber: parseInt(termNumber),
            },
          },
        },
      });

      if (result.length === 0) {
        return res.status(404).json({
          error: "No data exists for the provided info",
        });
      }

      res.status(200).json({
        message: "Successful retrieval",
        body: result,
        count: result.length,
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

      const result = await prisma.captainAttendance.findMany({
        where: {
          captainId: parseInt(captainId),
          weekNumber: parseInt(weekNumber),
          termNumber: parseInt(termNumber),
        },
      });

      res.status(200).json({
        message: "Successful retrieval",
        body: result,
        count: result.length,
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

      // NOTE: left as reference remove after testing
      // const result = await db.query(
      //   `
      //   SELECT "Captain".*, "CaptainAttendance".*
      //   FROM "Captain"
      //   LEFT JOIN "CaptainAttendance"
      //   ON "Captain"."captainId" = "CaptainAttendance"."captainId"
      //   AND "CaptainAttendance"."weekNumber" = $2 AND "CaptainAttendance"."termNumber" = $3
      //   INNER JOIN "Sector"
      //   ON "Sector"."baseName" = "Captain"."rSectorBaseName" AND "Sector"."suffixName" = "Captain"."rSectorSuffixName"
      //   WHERE "Sector"."unitCaptainId" = $1;
      //   `,
      //   [unitCaptainId, weekNumber, termNumber],
      // );

      // TODO: needs testing
      const result = await prisma.captain.findMany({
        where: {
          Sector_Sector_unitCaptainIdToCaptain: {
            some: {
              unitCaptainId: parseInt(unitCaptainId),
            },
          },
          CaptainAttendance: {
            some: {
              weekNumber: parseInt(weekNumber),
              termNumber: parseInt(termNumber),
            },
          },
        },
        include: {
          CaptainAttendance: {
            where: {
              weekNumber: parseInt(weekNumber),
              termNumber: parseInt(termNumber),
            },
          },
        },
      });

      if (!result.length) {
        return res.status(404).json({
          error: "No data exists for the provided info",
        });
      }

      res.status(200).json({
        message: "Successful retrieval",
        body: result,
        count: result.length,
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
