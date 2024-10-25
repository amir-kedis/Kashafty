import { Request, Response } from "express";
import { prisma } from "../database/db";
import { AttendanceStatus } from "@prisma/client";
import asyncDec from "../utils/asyncDec";
import AppError from "../utils/AppError";

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

async function upsertAttendance(
  req: UpsertAttendanceRequest,
  res: Response,
): Promise<any> {
  const { attendanceRecords } = req.body;

  if (!attendanceRecords || attendanceRecords.length === 0) {
    throw new AppError(404, "No records were found", "لم يتم العثور على سجلات");
  }

  const result = [];
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

  return res.status(200).json({
    message: "Successful insertion",
    body: result,
    count: result.length,
  });
}

async function getSectorAttendance(
  req: GetSectorAttendanceRequest,
  res: Response,
): Promise<any> {
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
    throw new AppError(
      404,
      "No data exists for the provided info",
      "لا توجد بيانات للمعلومات المقدمة",
    );
  }

  return res.status(200).json({
    message: "Successful retrieval",
    body: result,
    count: result.length,
  });
}

async function getCaptainAttendance(
  req: GetCaptainAttendanceRequest,
  res: Response,
): Promise<any> {
  const { captainId, weekNumber, termNumber } = req.params;

  const result = await prisma.captainAttendance.findMany({
    where: {
      captainId: parseInt(captainId),
      weekNumber: parseInt(weekNumber),
      termNumber: parseInt(termNumber),
    },
  });

  return res.status(200).json({
    message: "Successful retrieval",
    body: result,
    count: result.length,
  });
}

async function getUnitAttendance(
  req: GetUnitAttendanceRequest,
  res: Response,
): Promise<any> {
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
    orderBy: [{ firstName: "asc" }, { middleName: "asc" }, { lastName: "asc" }],
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

  const result = filteredCaptains.map((captain) => ({
    ...captain,
    attendanceStatus: captain?.CaptainAttendance
      ? captain?.CaptainAttendance[0]?.attendanceStatus
      : null,
  }));

  if (!result.length) {
    throw new AppError(
      404,
      "No data exists for the provided info",
      "لا توجد بيانات للمعلومات المقدمة",
    );
  }

  return res.status(200).json({
    message: "Successful retrieval",
    body: result,
    count: result.length,
  });
}

const captainAttendanceController = {
  upsertAttendance: asyncDec(upsertAttendance),
  getSectorAttendance: asyncDec(getSectorAttendance),
  getCaptainAttendance: asyncDec(getCaptainAttendance),
  getUnitAttendance: asyncDec(getUnitAttendance),
};

export default captainAttendanceController;
