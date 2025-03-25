import { NextFunction, Request, Response } from "express";
import { prisma } from "../database/db";
import { Gender } from "@prisma/client";
import AppError from "../utils/AppError";
import asyncDec from "../utils/asyncDec";
import getScoutByName from "../utils/getScoutsByName";

// =================================================
// TODO: This module needs testing
// =================================================

interface GetScoutsInSectorRequest extends Request {
  query: {
    sectorBaseName: string;
    sectorSuffixName: string;
  };
}

interface GetScoutsInUnitRequest extends Request {
  params: {
    unitCaptainId: string;
  };
}

interface UpdateScoutRequest extends Request {
  params: {
    scoutId: string;
  };
  body: {
    name: string;
    address?: string;
    phoneNumber?: string;
    gender?: string;
    sectorBaseName: string;
    sectorSuffixName: string;
    birthDate?: string;
    enrollDate?: string;
  };
}

interface InsertScoutRequest extends Request {
  body: {
    name: string;
    address?: string;
    phoneNumber?: string;
    gender?: string;
    sectorBaseName: string;
    sectorSuffixName: string;
    birthDate?: string;
    enrollDate?: string;
  };
}

// Get all scouts

async function getAllScouts(req: Request, res: Response) {
  let scouts, count;
  if (req.query.name) {
    scouts = await getScoutByName(req.query.name as string, {});
    count = scouts ? 1 : 0;
  } else {
    scouts = await prisma.scout.findMany();
    count = scouts.length;
  }

  if (!scouts) {
    throw new AppError(404, "No scouts found", "لم يتم العثور على كشافين");
  }

  res.status(200).json({
    message: "Successful retrieval",
    body: scouts,
    count,
  });
}

// Get scouts in a specific sector

async function getScoutsInSector(req: GetScoutsInSectorRequest, res: Response) {
  const { sectorBaseName, sectorSuffixName } = req.query;

  const result = await prisma.scout.findMany({
    where: {
      sectorBaseName: sectorBaseName,
      sectorSuffixName: sectorSuffixName,
    },
    orderBy: {
      name: "asc",
    },
  });

  res.status(200).json({
    message: "Successful retrieval",
    body: result,
    count: result.length,
  });
}

// Get scouts in a specific unit
async function getScoutsInUnit(req: GetScoutsInUnitRequest, res: Response) {
  const { unitCaptainId } = req.params;

  const result = await prisma.scout.findMany({
    where: {
      Sector: {
        unitCaptainId: parseInt(unitCaptainId),
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  res.status(200).json({
    message: "Successful retrieval",
    body: result,
    count: result.length,
  });
}

// Get a specific scout by ID

async function getScout(req: Request, res: Response) {
  const { scoutId: id } = req.params;
  
  if (!id || isNaN(parseInt(id))) {
    throw new AppError(400, 'Invalid scout ID', 'معرف الكشاف غير صالح');
  }
  
  const scout = await prisma.scout.findUnique({
    where: {
      scoutId: parseInt(id),
    },
    include: {
      Sector: true,
    },
  });
  
  if (!scout) {
    throw new AppError(404, 'Scout not found', 'لم يتم العثور على الكشاف');
  }
  
  return res.status(200).json({
    message: 'Scout retrieved successfully',
    arabicMessage: 'تم استرجاع بيانات الكشاف بنجاح',
    body: scout,
  });
}

// Update a specific scout by ID
async function updateScout(req: UpdateScoutRequest, res: Response) {
  const { scoutId } = req.params;
  const {
    name,
    address,
    phoneNumber,
    gender,
    sectorBaseName,
    sectorSuffixName,
    birthDate,
    enrollDate,
  } = req.body;

  const enrollDateParsed = enrollDate ? new Date(enrollDate) : null;
  const birthDateParsed = birthDate ? new Date(birthDate) : null;

  const scout = await prisma.scout.update({
    where: {
      scoutId: parseInt(scoutId),
    },
    data: {
      name,
      address,
      phoneNumber,
      gender: gender === "male" ? Gender.male : Gender.female,
      sectorBaseName,
      sectorSuffixName,
      enrollDate: enrollDateParsed,
      birthDate: birthDateParsed,
    },
  });

  res.status(200).json({
    message: "Successful update",
    body: scout,
  });
}

// Insert a new scout
async function insertScout(req: InsertScoutRequest, res: Response) {
  const {
    name,
    address,
    phoneNumber,
    gender,
    sectorBaseName,
    sectorSuffixName,
    birthDate,
    enrollDate,
  } = req.body;

  const enrollDateParsed = enrollDate ? new Date(enrollDate) : undefined;
  const birthDateParsed = birthDate ? new Date(birthDate) : undefined;

  const scout = await prisma.scout.create({
    data: {
      name,
      address,
      phoneNumber,
      gender: gender === "male" ? Gender.male : Gender.female,
      sectorBaseName,
      sectorSuffixName,
      enrollDate: enrollDateParsed,
      birthDate: birthDateParsed,
    },
  });

  res.status(200).json({
    message: "Successful insertion",
    body: scout,
  });
}

// Delete a specific scout by ID (expel)
async function expelScout(req: Request, res: Response) {
  const { scoutId } = req.params;

  const scout = await prisma.scout.update({
    where: {
      scoutId: parseInt(scoutId),
    },
    data: {
      expelled: true,
      expelDate: new Date(),
    },
  });

  if (!scout) {
    throw new AppError(404, "No scout found", "لم يتم العثور على الكشاف");
  }

  res.status(204).json({
    message: "Successful Removal",
    body: null,
  });
}

interface DeleteScoutRequest extends Request {
  params: {
    scoutId: string;
  };
  captain: {
    captainId: number;
    type: string;
    firstName: string;
    lastName: string;
    rSectorBaseName?: string;
    rSectorSuffixName?: string;
  };
}


async function deleteScoutHandler(req: DeleteScoutRequest, res: Response) {
  const { scoutId } = req.params;
  
  if (!scoutId || isNaN(parseInt(scoutId))) {
    throw new AppError(400, "Invalid scout ID", "معرف الكشاف غير صالح");
  }
  
  // Find the scout
  const scout = await prisma.scout.findUnique({
    where: { scoutId: parseInt(scoutId) },
  });
  
  if (!scout) {
    throw new AppError(404, "Scout not found", "الكشاف غير موجود");
  }
  
  // Check permissions for unit captains
  if (req.captain.type === "unit") {
    if (
      scout.sectorBaseName !== req.captain.rSectorBaseName ||
      scout.sectorSuffixName !== req.captain.rSectorSuffixName
    ) {
      throw new AppError(
        403, 
        "You cannot delete scouts from other sectors", 
        "لا يمكنك حذف كشاف من قطاع آخر"
      );
    }
  }
  
  // Create audit log
  await prisma.notification.create({
    data: {
      type: "other",
      status: "UNREAD",
      title: "حذف كشاف",
      message: `تم حذف الكشاف ${scout.name} بواسطة ${req.captain.firstName} ${req.captain.lastName}`,
      captainId: req.captain.captainId,
    },
  });
  
  // Delete the scout
  await prisma.scout.delete({
    where: { scoutId: parseInt(scoutId) },
  });
  
  res.status(200).json({
    message: "Scout deleted successfully",
    arabicMessage: "تم حذف الكشاف بنجاح",
  });
}

async function getScoutsBySectorWithAttendance(req: Request, res: Response) {
  const { baseName, suffixName } = req.query;
  
  if (!baseName || !suffixName) {
    throw new AppError(400, 'Sector information is required', 'معلومات القطاع مطلوبة');
  }
  
  // Get current term
  const currentTerm = await prisma.term.findFirst({
    orderBy: { termNumber: 'desc' },
  });
  
  if (!currentTerm) {
    throw new AppError(404, 'No active term found', 'لا يوجد فترة نشطة');
  }
  
  // Get scouts with attendance data
  const scouts = await prisma.scout.findMany({
    where: {
      sectorBaseName: baseName as string,
      sectorSuffixName: suffixName as string,
    },
    include: {
      ScoutAttendance: {
        where: {
          Week: {
            termNumber: currentTerm.termNumber,
          },
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });
  
  // Calculate attendance statistics
  const scoutsWithStats = scouts.map(scout => {
    const attendedCount = scout.ScoutAttendance.filter(
      a => a.attendanceStatus === 'attended'
    ).length;
    
    const absentCount = scout.ScoutAttendance.filter(
      a => a.attendanceStatus === 'absent'
    ).length;
    
    return {
      ...scout,
      attendedCount,
      absentCount,
    };
  });
  
  return res.status(200).json({
    message: 'Scouts retrieved successfully',
    arabicMessage: 'تم استرجاع بيانات الكشافة بنجاح',
    body: scoutsWithStats,
  });
}

// Controller with asyncDec decorator applied and error handling
const scoutController = {
  getAllScouts: asyncDec(getAllScouts),
  getScoutsInSector: asyncDec(getScoutsInSector),
  getScoutsInUnit: asyncDec(getScoutsInUnit),
  getScout: asyncDec(getScout),
  updateScout: asyncDec(updateScout),
  insertScout: asyncDec(insertScout),
  deleteScout: asyncDec(deleteScoutHandler),
  unexpelScout: asyncDec(expelScout),
  expelScout: asyncDec(expelScout),
  getScoutsBySectorWithAttendance: asyncDec(getScoutsBySectorWithAttendance),
};

export default scoutController;
