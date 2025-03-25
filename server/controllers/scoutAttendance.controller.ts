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
  res: Response
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
        attendance.termNumber === parseInt(termNumber)
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
  res: Response
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

async function getScoutAttendanceHistory(req: Request, res: Response) {
  const { scoutId } = req.params;

  if (!scoutId || isNaN(parseInt(scoutId))) {
    throw new AppError(400, "Invalid scout ID", "معرف الكشاف غير صالح");
  }

  // Get all attendance records for the scout
  const attendanceHistory = await prisma.scoutAttendance.findMany({
    where: {
      scoutId: parseInt(scoutId),
    },
    include: {
      Week: {
        include: {
          Term: true,
        },
      },
      Scout: true,
    },
    orderBy: [
      { Week: { termNumber: "desc" } },
      { Week: { weekNumber: "desc" } },
    ],
  });

  // Format the response
  const formattedHistory = attendanceHistory.map((record) => ({
    weekNumber: record.Week.weekNumber,
    termNumber: record.Week.termNumber,
    termName: record.Week.Term.termName,
    date: record.Week.startDate,
    attendanceStatus: record.attendanceStatus,
  }));

  return res.status(200).json({
    message: "Scout attendance history retrieved successfully",
    arabicMessage: "تم استرجاع سجل حضور الكشاف بنجاح",
    body: formattedHistory,
  });
}

async function getScoutAttendanceStats(req: Request, res: Response) {
  const { scoutId } = req.params;


  if (!scoutId || isNaN(parseInt(scoutId))) {
    throw new AppError(400, "Invalid scout ID", "معرف الكشاف غير صالح");
  }

  // Get all terms
  const terms = await prisma.term.findMany({
    orderBy: {
      termNumber: "desc",
    },
  });

  // Get attendance stats for each term
  const stats = await Promise.all(
    terms.map(async (term) => {
      const attendance = await prisma.scoutAttendance.findMany({
        where: {
          scoutId: parseInt(scoutId),
          Week: {
            termNumber: term.termNumber,
          },
        },
        include: {
          Week: true,
          Scout: true,
        },
      });

      const attended = attendance.filter(
        (a) => a.attendanceStatus === "attended"
      ).length;
      const absent = attendance.filter(
        (a) => a.attendanceStatus === "absent"
      ).length;

      return {
        termNumber: term.termNumber,
        termName: term.termName,
        attended,
        absent,
      };
    })
  );

  // Filter out terms with no attendance records
  const filteredStats = stats.filter(
    (term) => term.attended > 0 || term.absent > 0
  );

  return res.status(200).json({
    message: "Scout attendance stats retrieved successfully",
    arabicMessage: "تم استرجاع إحصائيات حضور الكشاف بنجاح",
    body: filteredStats,
  });
}

const scoutAttendanceController = {
  upsertAttendance: asyncDec(upsertAttendance),
  getSectorAttendance: asyncDec(getSectorAttendance),
  getScoutAttendance: asyncDec(getScoutAttendance),
  getScoutAttendanceHistory: asyncDec(getScoutAttendanceHistory),
  getScoutAttendanceStats: asyncDec(getScoutAttendanceStats),
};

export default scoutAttendanceController;
