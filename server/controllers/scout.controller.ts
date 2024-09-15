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
  baseName: string;
  suffixName: string;
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
  address: string;
  phoneNumber: string;
  gender: string;
  sectorBaseName: string;
  sectorSuffixName: string;
  birthDate: string;
  enrollDate: string;
};
}

interface InsertScoutRequest extends Request {
body: {
  name: string;
  address: string;
  phoneNumber: string;
  gender: string;
  sectorBaseName: string;
  sectorSuffixName: string;
  birthDate: string;
  enrollDate: string;
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
  const { baseName, suffixName } = req.query;

  const result = await prisma.scout.findMany({
    where: {
      sectorBaseName: baseName,
      sectorSuffixName: suffixName,
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
async function updateScout (req: UpdateScoutRequest, res: Response){
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
      enrollDate: new Date(enrollDate),
      birthDate: new Date(birthDate),
      updatedAt: new Date(),
    },
  });

  res.status(200).json({
    message: "Successful update",
    body: scout,
  });
};

// Insert a new scout
async function insertScout (req: InsertScoutRequest, res: Response) {
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

    const scout = await prisma.scout.create({
      data: {
        name,
        address,
        phoneNumber,
        gender: gender === "male" ? Gender.male : Gender.female,
        sectorBaseName,
        sectorSuffixName,
        birthDate: new Date(birthDate),
        enrollDate: new Date(enrollDate),
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
