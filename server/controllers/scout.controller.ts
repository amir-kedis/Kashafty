import { Request, Response } from "express";
import { prisma } from "../database/db";
import { Gender } from "@prisma/client";
import AppError from "../utils/AppError";
import asyncDec from "../utils/asyncDec";

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
    firstName: string;
    middleName: string;
    lastName: string;
    gender: string;
    sectorBaseName: string;
    sectorSuffixName: string;
    birthDate: string;
    enrollDate: string;
    schoolGrade: string;
    photo: string;
    birthCertificate: string;
  };
}

interface InsertScoutRequest extends Request {
  body: {
    firstName: string;
    middleName: string;
    lastName: string;
    gender: string;
    sectorBaseName: string;
    sectorSuffixName: string;
    birthDate: string;
    enrollDate: string;
    schoolGrade: string;
    photo: string;
    birthCertificate: string;
  };
}

// Get all scouts

async function getAllScouts(req: Request, res: Response) {
  const scouts = await prisma.scout.findMany();
  res.status(200).json({
    message: "Successful retrieval",
    body: scouts,
    count: scouts.length,
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
  });

  res.status(200).json({
    message: "Successful retrieval",
    body: result,
    count: result.length,
  });
}



// Get a specific scout by ID

async function getScout(req: Request, res: Response) {
  const { scoutId } = req.params;

  const result = await prisma.scout.findUnique({
    where: {
      scoutId: parseInt(scoutId),
    },
    include: {
      ScoutProfile: true,
    },
  });

  if (!result) {
    throw new AppError(404, "No scout found", "لم يتم العثور على الكشاف");
  }

  res.status(200).json({
    message: "Successful retrieval",
    body: result,
  });
}




// Update a specific scout by ID
async function updateScout(req: UpdateScoutRequest, res: Response) {
  const { scoutId } = req.params;
  const {
    firstName,
    middleName,
    lastName,
    gender,
    sectorBaseName,
    sectorSuffixName,
    birthDate,
    enrollDate,
    schoolGrade,
    photo,
    birthCertificate,
  } = req.body;

  const scout = await prisma.scout.update({
    where: {
      scoutId: parseInt(scoutId),
    },
    data: {
      firstName,
      middleName,
      lastName,
      gender: gender === "male" ? Gender.male : Gender.female,
      sectorBaseName,
      sectorSuffixName,
      ScoutProfile: {
        update: {
          birthDate: new Date(birthDate),
          enrollDate: new Date(enrollDate),
          schoolGrade: parseInt(schoolGrade),
          photo,
          birthCertificate,
        },
      },
    },
  });

  res.status(200).json({
    message: "Successful update",
    body: scout,
  });
};

// Insert a new scout
async function insertScout(req: InsertScoutRequest, res: Response) {
  const {
    firstName,
    middleName,
    lastName,
    gender,
    sectorBaseName,
    sectorSuffixName,
    birthDate,
    enrollDate,
    schoolGrade,
    photo,
    birthCertificate,
  } = req.body;

  const scout = await prisma.scout.create({
    data: {
      firstName,
      middleName,
      lastName,
      gender: gender === "male" ? Gender.male : Gender.female,
      sectorBaseName,
      sectorSuffixName,
      ScoutProfile: {
        create: {
          birthDate: new Date(birthDate),
          enrollDate: new Date(enrollDate),
          schoolGrade: parseInt(schoolGrade),
          photo,
          birthCertificate,
        },
      },
    },
  });

  res.status(200).json({
    message: "Successful insertion",
    body: scout,
  });
};

// Controller with asyncDec decorator applied and error handling
const scoutController = {
  getAllScouts: asyncDec(getAllScouts),
  getScoutsInSector: asyncDec(getScoutsInSector),
  getScoutsInUnit: asyncDec(getScoutsInUnit),
  getScout: asyncDec(getScout),
  updateScout: asyncDec(updateScout),
  insertScout: asyncDec(insertScout),
};

export default scoutController;
