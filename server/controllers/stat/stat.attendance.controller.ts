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
import getScoutByName from "../../utils/getScoutsByName";
import { Scout } from "@prisma/client";
import AppError from "../../utils/AppError";
import asyncDec from "../../utils/asyncDec";

async function getAttendanceRate(req: Request, res: Response) {
  const { sectorBaseName, sectorSuffixName, unitCaptainId } = req.query;

  if (!req.currentTerm) {
    throw new AppError(400, "Can't get the current term", "لا يمكن الحصول على الفصل الحالي");
  }

  let requestType: "all" | "sector" | "unit";

  if (sectorBaseName && sectorSuffixName) requestType = "sector";
  else if (unitCaptainId) requestType = "unit";
  else requestType = "all";

  let absenceCount: number;
  let attendanceCount: number;

  const baseWhereClause = {
    termNumber: req.currentWeek?.termNumber,
    Week: { cancelled: false },
  };

  switch (requestType) {
    case "all":
      absenceCount = await prisma.scoutAttendance.count({
        where: { ...baseWhereClause, attendanceStatus: "absent" },
      });
      attendanceCount = await prisma.scoutAttendance.count({
        where: { ...baseWhereClause, attendanceStatus: "attended" },
      });
      break;
    case "sector":
      absenceCount = await prisma.scoutAttendance.count({
        where: {
          ...baseWhereClause,
          attendanceStatus: "absent",
          Scout: {
            sectorBaseName: sectorBaseName as string,
            sectorSuffixName: sectorSuffixName as string,
          },
        },
      });
      attendanceCount = await prisma.scoutAttendance.count({
        where: {
          ...baseWhereClause,
          attendanceStatus: "attended",
          Scout: {
            sectorBaseName: sectorBaseName as string,
            sectorSuffixName: sectorSuffixName as string,
          },
        },
      });
      break;
    case "unit":
      absenceCount = await prisma.scoutAttendance.count({
        where: {
          ...baseWhereClause,
          attendanceStatus: "absent",
          Scout: {
            Sector: { unitCaptainId: parseInt(unitCaptainId as string) },
          },
        },
      });
      attendanceCount = await prisma.scoutAttendance.count({
        where: {
          ...baseWhereClause,
          attendanceStatus: "attended",
          Scout: {
            Sector: { unitCaptainId: parseInt(unitCaptainId as string) },
          },
        },
      });
      break;
  }

  const attendanceRate = computeAttendanceRate({
    attendance_count: attendanceCount,
    absence_count: absenceCount,
  });

  return res.status(200).json({
    message: `Get attendance rate for ${requestType} successfully`,
    body: attendanceRate,
  });
}

async function getAttendanceLineChart(req: Request, res: Response) {
  const { sectorBaseName, sectorSuffixName, unitCaptainId } = req.query;

  if (req.currentWeek?.termNumber === 0) {
    throw new AppError(400, "Cannot get absence rate before the term starts", "لا يمكن الحصول على معدل الغياب قبل بدء الفصل الدراسي");
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
}

async function getAttendanceStackLineChart(req: Request, res: Response) {
  if (req.currentWeek?.termNumber === 0) {
    throw new AppError(400, "Cannot get absence rate before the term starts", "لا يمكن الحصول على معدل الغياب قبل بدء الفصل الدراسي");
  }

  const sectors = await prisma.sector.findMany();

  let sectorGraphs = await Promise.all(sectors.map(async (sector) => {
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
            sectorBaseName: sector.baseName,
            sectorSuffixName: sector.suffixName,
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
            sectorBaseName: sector.baseName,
            sectorSuffixName: sector.suffixName,
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

    return {
      sectorBaseName: sector.baseName,
      sectorSuffixName: sector.suffixName,
      attendanceRates,
    };
  }));

  return res.status(200).json({
    message: `Get stacked attendance graph successfully`,
    body: sectorGraphs,
  });
}

async function getScoutAttendanceRate(req: Request, res: Response) {
  const { name } = req.query;
  if (!name)
    throw new AppError(400, "No scouts match this name", "لا يوجد كشافة بهذا الاسم");

  let scouts = (await getScoutByName(name as string)) as Scout[] | null;

  if (!scouts)
    throw new AppError(400, "No scouts match this name", "لا يوجد كشافة بهذا الاسم");

  const result = await Promise.all(
    scouts.map(async (scout) => {
      let absenceCount = await prisma.scoutAttendance.count({
        where: {
          attendanceStatus: "absent",
          termNumber: undefined,
          Week: {
            cancelled: false,
          },
          Scout: {
            scoutId: scout.scoutId,
          },
        },
      });

      let attendanceCount = await prisma.scoutAttendance.count({
        where: {
          attendanceStatus: "attended",
          termNumber: undefined,
          Week: {
            cancelled: false,
          },
          Scout: {
            scoutId: scout.scoutId,
          },
        },
      });

      let attendanceRate = computeAttendanceRate({
        attendance_count: attendanceCount,
        absence_count: absenceCount,
      });

      return {
        id: scout.scoutId,
        name: scout.name,
        attendanceRate: attendanceRate,
      };
    })
  );

  return res.status(200).json({
    message: `Found ${scouts.length} matching this name`,
    body: result,
  });
}

const statAttendanceController = {
  getAttendanceRate: asyncDec(getAttendanceRate),
  getAttendanceLineChart: asyncDec(getAttendanceLineChart),
  getAttendanceStackLineChart: asyncDec(getAttendanceStackLineChart),
  getScoutAttendanceRate: asyncDec(getScoutAttendanceRate),
};

export default statAttendanceController;