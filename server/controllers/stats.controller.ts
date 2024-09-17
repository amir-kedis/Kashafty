import { Request, Response } from "express";
import { prisma } from "../database/db";
import { computeAttendanceRate } from "../utils/computeAbsenceRate";
import { AttendanceStatus } from "@prisma/client";
import AppError from "../utils/AppError";
import asyncDec from "../utils/asyncDec";

interface StatsRequest extends Request {
  currentWeek?: {
    termNumber: number;
    weekNumber: number;
  };
  currentTerm?: {
    termNumber: number;
  };
  query: {
    sectorBaseName?: string;
    sectorSuffixName?: string;
  }
}

async function getAllScoutsAbsenceRate(req: StatsRequest, res: Response) {
  if (req.currentWeek?.termNumber === 0) {
    throw new AppError(400, "Cannot get absence rate before the term starts", "لا يمكن الحصول على معدل الغياب قبل بدء الفصل الدراسي");
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
    throw new AppError(400, "There are no attendance records", "لا توجد سجلات حضور");
  }

  return res.status(200).json({
    message: "Get absence rate successfully",
    body: absenceRate,
  });
}

async function getScoutsInUnitAbsenceRate(req: StatsRequest, res: Response) {
  const { unitCaptainId: unitCaptainIdStr } = req.params;
  const unitCaptainId = parseInt(unitCaptainIdStr);

  if (req.currentWeek?.termNumber === 0) {
    throw new AppError(400, "Cannot get absence rate before the term starts", "لا يمكن الحصول على معدل الغياب قبل بدء الفصل الدراسي");
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
    throw new AppError(400, "There are no attendance records for this unit", "لا توجد سجلات حضور لهذه الوحدة");
  }

  return res.status(200).json({
    message: "Get absence rate successfully",
    body: absenceRate,
  });
}

async function getScoutsInSectorAbsenceRate(req: StatsRequest, res: Response) {
  const { sectorBaseName, sectorSuffixName } = req.query;

  if (req.currentWeek?.termNumber === 0) {
    throw new AppError(400, "Cannot get absence rate before the term starts", "لا يمكن الحصول على معدل الغياب قبل بدء الفصل الدراسي");
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
  //////in top everything is right.
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
    throw new AppError(400, "There are no attendance records for this sector", "لا توجد سجلات حضور لهذا القطاع");
  }

  return res.status(200).json({
    message: "Get absence rate successfully",
    body: absenceRate,
  });
}

async function getScoutAbsenceRate(req: StatsRequest, res: Response) {
  const { scoutId: scoutIdStr } = req.params;
  const scoutId = parseInt(scoutIdStr);

  if (req.currentWeek?.termNumber === 0) {
    throw new AppError(400, "Cannot get absence rate before the term starts", "لا يمكن الحصول على معدل الغياب قبل بدء الفصل الدراسي");
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
    throw new AppError(400, "There are no attendance records for this scout", "لا توجد سجلات حضور لهذا الكشاف");
  }

  return res.status(200).json({
    message: "Get absence rate successfully",
    body: absenceRate,
  });
}

async function getAllScoutsAbsenceRateGraph(req: StatsRequest, res: Response) {
  if (req.currentWeek?.termNumber === 0) {
    throw new AppError(400, "Cannot get absence rate before the term starts", "لا يمكن الحصول على معدل الغياب قبل بدء الفصل الدراسي");
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
}

async function getScoutsInUnitAbsenceRateGraph(req: StatsRequest, res: Response) {
  const { unitCaptainId: unitCaptainIdStr } = req.params;
  const unitCaptainId = parseInt(unitCaptainIdStr);

  if (req?.currentWeek?.termNumber === 0) {
    throw new AppError(400, "Cannot get absence rate before the term starts", "لا يمكن الحصول على معدل الغياب قبل بدء الفصل الدراسي");
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
}

async function getScoutsInSectorAbsenceRateGraph(req: StatsRequest, res: Response) {
  const { sectorBaseName, sectorSuffixName } = req.params;

  if (req?.currentWeek?.termNumber === 0) {
    throw new AppError(400, "Cannot get absence rate before the term starts", "لا يمكن الحصول على معدل الغياب قبل بدء الفصل الدراسي");
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
}

const statsController = {
  getAllScoutsAbsenceRate: asyncDec(getAllScoutsAbsenceRate),
  getScoutsInUnitAbsenceRate: asyncDec(getScoutsInUnitAbsenceRate),
  getScoutsInSectorAbsenceRate: asyncDec(getScoutsInSectorAbsenceRate),
  getScoutAbsenceRate: asyncDec(getScoutAbsenceRate),
  getAllScoutsAbsenceRateGraph: asyncDec(getAllScoutsAbsenceRateGraph),
  getScoutsInUnitAbsenceRateGraph: asyncDec(getScoutsInUnitAbsenceRateGraph),
  getScoutsInSectorAbsenceRateGraph: asyncDec(getScoutsInSectorAbsenceRateGraph),
};

export default statsController;
