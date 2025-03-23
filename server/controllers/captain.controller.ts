import { Request, Response } from "express";
import { prisma } from "../database/db";
import { Captain } from "@prisma/client";
import AppError from "../utils/AppError";
import asyncDec from "../utils/asyncDec";

interface GetAllCaptainsRequest extends Request {
  query: {
    type?: string;
  };
}

interface GetCaptainsInSectorRequest extends Request {
  query: {
    baseName: string;
    suffixName: string;
  };
}

interface GetCaptainsInUnitRequest extends Request {
  params: {
    unitCaptainId: string;
  };
}

interface GetCaptainRequest extends Request {
  params: {
    captainId: string;
  };
}

async function getAllCaptains(req: GetAllCaptainsRequest, res: Response) {
  const { type } = req.query;

  let result: Captain[] = await prisma.captain.findMany({
    orderBy: [{ firstName: "asc" }, { middleName: "asc" }],
  });

  if (type) {
    result = result.filter((captain) => captain.type === type);
  }

  return res.status(200).json({
    message: "Successful retrieval",
    body: result,
    count: result.length,
  });
}

async function getCaptainsInSector(
  req: GetCaptainsInSectorRequest,
  res: Response,
) {
  const { baseName, suffixName } = req.query;

  const result = await prisma.captain.findMany({
    where: {
      rSectorBaseName: baseName,
      rSectorSuffixName: suffixName,
    },
    orderBy: [{ firstName: "asc" }, { middleName: "asc" }, { lastName: "asc" }],
  });

  return res.status(200).json({
    message: "Successful retrieval",
    body: result,
    count: result.length,
  });
}

async function getCaptainsInUnit(req: GetCaptainsInUnitRequest, res: Response) {
  const { unitCaptainId } = req.params;

  const result = await prisma.captain.findMany({
    where: {
      type: "regular",
      Sector_Captain_rSectorBaseName_rSectorSuffixNameToSector: {
        unitCaptainId: parseInt(unitCaptainId),
      },
    },
    orderBy: [{ firstName: "asc" }, { middleName: "asc" }, { lastName: "asc" }],
  });

  return res.status(200).json({
    message: "Successful retrieval",
    body: result,
    count: result.length,
  });
}

async function getCaptain(req: GetCaptainRequest, res: Response): Promise<any> {
  const { captainId } = req.params;

  if (!captainId) {
    throw new AppError(400, "Please enter a valid id", "الرجاء إدخال رقم صحيح");
  }

  console.log({captainId});
  const result = await prisma.captain.findUnique({
    where: {
      captainId: parseInt(captainId),
    },
  });

  if (!result) {
    throw new AppError(404, "Captain not found!", "القائد غير موجود");
  }

  return res.status(200).json({
    message: "Successful retrieval",
    body: result,
  });
}

async function setCaptainType(req: Request, res: Response): Promise<any> {
  const { captainId } = req.params;
  const { type } = req.body;

  if (!captainId) {
    throw new AppError(400, "Please enter a valid id", "الرجاء إدخال رقم صحيح");
  }

  if (type !== "regular" && type !== "unit" && type !== "general") {
    throw new AppError(
      400,
      "Please enter a valid captain type",
      "الرجاء إدخال نوع قائد صحيح",
    );
  }

  const result = await prisma.captain.update({
    where: {
      captainId: parseInt(captainId),
    },
    data: {
      type,
    },
  });

  return res.status(200).json({
    message: "Successful update",
    body: result,
  });
}

async function getCaptainsBySector(req: Request, res: Response) {
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
  
  // Get captains with attendance data
  const captains = await prisma.captain.findMany({
    where: {
      rSectorBaseName: baseName as string,
      rSectorSuffixName: suffixName as string,
    },
    include: {
      CaptainAttendance: {
        where: {
          Week: {
            termNumber: currentTerm.termNumber,
          },
        },
      },
    },
    orderBy: {
      firstName: 'asc',
    },
  });
  
  // Calculate attendance statistics
  const captainsWithStats = captains.map(captain => {
    const attendedCount = captain.CaptainAttendance.filter(
      a => a.attendanceStatus === 'attended'
    ).length;
    
    const absentCount = captain.CaptainAttendance.filter(
      a => a.attendanceStatus === 'absent'
    ).length;
    
    return {
      ...captain,
      attendedCount,
      absentCount,
    };
  });
  
  return res.status(200).json({
    message: 'Captains retrieved successfully',
    arabicMessage: 'تم استرجاع بيانات القادة بنجاح',
    body: captainsWithStats,
  });
}

const captainController = {
  getAllCaptains: asyncDec(getAllCaptains),
  getCaptainsInSector: asyncDec(getCaptainsInSector),
  getCaptainsInUnit: asyncDec(getCaptainsInUnit),
  getCaptain: asyncDec(getCaptain),
  setCaptainType: asyncDec(setCaptainType),
  getCaptainsBySector: asyncDec(getCaptainsBySector),
};

export default captainController;
