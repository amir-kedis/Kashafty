import { Request, Response } from "express";
import { prisma } from "../database/db";
import { AttendanceStatus } from "@prisma/client";
import AppError from "../utils/AppError";
import asyncDec from "../utils/asyncDec";

// =================================================
// TODO: This module needs reconnecting with frontend
// =================================================

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

async function upsertAttendance(req: UpsertAttendanceRequest, res: Response) {
  const { attendanceRecords } = req.body;

  if (!attendanceRecords || attendanceRecords.length === 0) {
    throw new AppError(404, "No records were found", "لم يتم العثور على سجلات");
  }

  let result = [];

  for (let i = 0; i < attendanceRecords.length; i++) {
    const attendanceRecord = await prisma.scoutAttendance.upsert({
      where: {
        scoutId_weekNumber_termNumber: {
          scoutId: parseInt(attendanceRecords[i].scoutId),
          weekNumber: attendanceRecords[i].weekNumber,
          termNumber: attendanceRecords[i].termNumber,
        },
      },
      update: {
        attendanceStatus: attendanceRecords[i]
          .attendanceStatus as AttendanceStatus,
      },
      create: {
        scoutId: parseInt(attendanceRecords[i].scoutId),
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
}

async function getSectorAttendance(
  req: GetSectorAttendanceRequest,
  res: Response,
) {
  let { baseName, suffixName, weekNumber, termNumber } = req.query;

  const scouts = await prisma.scout.findMany({
    where: {
      sectorBaseName: baseName,
      sectorSuffixName: suffixName,
    },
    include: {
      ScoutAttendance: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const filteredWeeks = scouts.map((scout) => {
    const filteredAttendance = scout.ScoutAttendance.filter(
      (attendance) =>
        attendance.weekNumber === parseInt(weekNumber) &&
        attendance.termNumber === parseInt(termNumber),
    );
    return {
      ...scout,
      ScoutAttendance:
        filteredAttendance.length > 0 ? filteredAttendance : null,
    };
  });

  const result = filteredWeeks.map((scout) => ({
    ...scout,
    attendanceStatus: scout?.ScoutAttendance
      ? scout?.ScoutAttendance[0]?.attendanceStatus
      : null,
  }));

  res.status(200).json({
    message: "Successful retrieval",
    body: result,
    count: result.length,
  });
}

async function getScoutAttendance(
  req: GetScoutAttendanceRequest,
  res: Response,
) {
  let { scoutId, weekNumber, termNumber } = req.params;

  const result = await prisma.scoutAttendance.findMany({
    where: {
      scoutId: parseInt(scoutId),
      weekNumber: parseInt(weekNumber),
      termNumber: parseInt(termNumber),
    },
  });

  res.status(200).json({
    message: "Successful retrieval",
    body: result,
    count: result.length,
  });
}

const scoutAttendanceController = {
  upsertAttendance: asyncDec(upsertAttendance),
  getSectorAttendance: asyncDec(getSectorAttendance),
  getScoutAttendance: asyncDec(getScoutAttendance),
};

export default scoutAttendanceController;

