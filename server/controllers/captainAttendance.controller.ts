import { Request, Response } from "express";
import { prisma } from "../database/db";
import { AttendanceStatus } from "@prisma/client";

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
      if (!attendanceRecords || attendanceRecords.length === 0) {
        return res.status(404).json({
          error: "No records were found",
        });
      }
      let result = [];
      for (let i = 0; i < attendanceRecords.length; i++) {
        const attendanceRecord = await prisma.captainAttendance.upsert({
          where: {
            captainId_weekNumber_termNumber: {
              captainId: parseInt(attendanceRecords[i].captainId),
              weekNumber: attendanceRecords[i].weekNumber,
              termNumber: attendanceRecords[i].termNumber,
            },
          },
          update: {
            attendanceStatus: attendanceRecords[i]
              .attendanceStatus as AttendanceStatus,
          },
          create: {
            captainId: parseInt(attendanceRecords[i].captainId),
            weekNumber: attendanceRecords[i].weekNumber,
            termNumber: attendanceRecords[i].termNumber,
            attendanceStatus: attendanceRecords[i]
              .attendanceStatus as AttendanceStatus,
          },
        });
        result.push(attendanceRecord);
      }
      res.status(200).json({
        message: "Successful insertion",
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
      let {
        unitCaptainId,
        weekNumber: weekNumberStr,
        termNumber: termNumberStr,
      } = req.query;
      const weekNumber = parseInt(weekNumberStr);

      let termNumber = termNumberStr ? parseInt(termNumberStr) : undefined;
      if (!termNumber) {
        const latestTerm = await prisma.term.findFirst({
          orderBy: { termNumber: "desc" },
        });
        termNumber = latestTerm?.termNumber;
      }

      const captains = await prisma.captain.findMany({
        where: {
          Sector_Captain_rSectorBaseName_rSectorSuffixNameToSector: {
            unitCaptainId: parseInt(unitCaptainId),
          },
        },
        include: {
          CaptainAttendance: true,
        },
      });

      // Filter CaptainAttendance for the specified weekNumber and termNumber
      const filteredCaptains = captains.map((captain) => {
        const filteredAttendance = captain.CaptainAttendance.filter(
          (attendance) =>
            attendance.weekNumber === weekNumber &&
            attendance.termNumber === termNumber,
        );
        return {
          ...captain,
          CaptainAttendance:
            filteredAttendance.length > 0 ? filteredAttendance : null,
        };
      });

      const result = filteredCaptains.map((captain) => {
        return {
          ...captain,
          attendanceStatus: captain?.CaptainAttendance
            ? captain?.CaptainAttendance[0]?.attendanceStatus
            : null,
        };
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
