import { Request, Response } from "express";
import { prisma } from "../database/db";
import AppError from "../utils/AppError";
import asyncDec from "../utils/asyncDec";

// =================================================
// TODO: This module needs testing
// - integration testing with frontend
// =================================================

interface GetAllSectorsRequest extends Request {
  body: {};
}

interface GetAllSectorsInUnitRequest extends Request {
  params: {
    unitCaptainId: string;
  };
}

interface GetSectorRequest extends Request {
  query: {
    baseName: string;
    suffixName: string;
  };
}

interface InsertSectorRequest extends Request {
  body: {
    baseName: string;
    suffixName?: string;
    unitCaptainId?: string;
  };
}

interface SetUnitCaptainRequest extends Request {
  query: {
    baseName: string;
    suffixName: string;
  };
  body: {
    unitCaptainId: string;
  };
}

interface AssignCaptainRequest extends Request {
  query: {
    baseName: string;
    suffixName: string;
  };
  body: {
    captainId: string;
  };
}

async function getAllSectors(_: GetAllSectorsRequest, res: Response) {
  const result = await prisma.sector.findMany({
    orderBy: [{ baseName: "asc" }, { suffixName: "asc" }],
  });

  res.status(200).json({
    message: "Successful retrieval",
    body: result,
    count: result.length,
  });
}

async function getAllSectorsInUnit(
  req: GetAllSectorsInUnitRequest,
  res: Response,
) {
  const { unitCaptainId: unitCaptainIdString } = req.params;
  const unitCaptainId = parseInt(unitCaptainIdString);

  const result = await prisma.sector.findMany({
    where: {
      unitCaptainId,
    },
    orderBy: [{ baseName: "asc" }, { suffixName: "asc" }],
  });

  res.status(200).json({
    message: "Successful retrieval",
    body: result,
    count: result.length,
  });
}

async function getSector(req: GetSectorRequest, res: Response) {
  const { baseName, suffixName } = req.query;

  const result = await prisma.sector.findUnique({
    where: {
      baseName_suffixName: {
        baseName,
        suffixName,
      },
    },
  });

  res.status(200).json({
    message: "Successful retrieval",
    body: result,
  });
}

async function insertSector(req: InsertSectorRequest, res: Response) {
  let { baseName, suffixName, unitCaptainId: unitCaptainIdStr } = req.body;
  const unitCaptainId = unitCaptainIdStr ? parseInt(unitCaptainIdStr) : null;

  if (!baseName) {
    throw new AppError(
      400,
      "You must insert a baseName for the sector",
      "يجب إدخال اسم أساسي للقطاع",
    );
  }

  if (!suffixName) {
    suffixName = "";
  }

  const result = await prisma.sector.create({
    data: {
      baseName,
      suffixName,
      unitCaptainId,
    },
  });

  res.status(200).json({
    message: "Successful insertion",
    body: result,
  });
}

async function setUnitCaptain(req: SetUnitCaptainRequest, res: Response) {
  const { baseName, suffixName } = req.query;
  const { unitCaptainId: unitCaptainIdStr } = req.body;
  const unitCaptainId = parseInt(unitCaptainIdStr);

  if (!unitCaptainId) {
    throw new AppError(
      400,
      "Please provide a valid unit captain id",
      "يرجى تقديم معرف قائد وحدة صالح",
    );
  }

  const sector = await prisma.sector.findUnique({
    where: {
      baseName_suffixName: {
        baseName,
        suffixName,
      },
    },
  });

  if (!sector) {
    throw new AppError(
      404,
      "No sector exists with these ids",
      "لا يوجد قطاع بهذه المعرفات",
    );
  }

  const captain = await prisma.captain.findUnique({
    where: {
      captainId: unitCaptainId,
    },
  });

  if (!captain) {
    throw new AppError(
      404,
      "No captain exists with this id",
      "لا يوجد قائد بهذا المعرف",
    );
  }

  if (captain?.type !== "unit") {
    throw new AppError(
      400,
      "The provided captain id is not for a unit captain",
      "معرف القائد المقدم ليس لقائد وحدة",
    );
  }

  const result = await prisma.sector.update({
    where: {
      baseName_suffixName: {
        baseName,
        suffixName,
      },
    },
    data: {
      unitCaptainId,
    },
  });

  res.status(200).json({
    message: "Successful update",
    body: result,
  });
}

async function assignCaptain(req: AssignCaptainRequest, res: Response) {
  const { baseName, suffixName } = req.query;
  const { captainId: captainIdStr } = req.body;
  const captainId = parseInt(captainIdStr);

  const result = await prisma.captain.update({
    where: {
      captainId,
    },
    data: {
      rSectorBaseName: baseName,
      rSectorSuffixName: suffixName,
    },
  });

  res.status(200).json({
    message: "Successful assignment",
    body: result,
    count: 1,
  });
}

const sectorController = {
  getAllSectors: asyncDec(getAllSectors),
  getAllSectorsInUnit: asyncDec(getAllSectorsInUnit),
  getSector: asyncDec(getSector),
  insertSector: asyncDec(insertSector),
  setUnitCaptain: asyncDec(setUnitCaptain),
  assignCaptain: asyncDec(assignCaptain),
};

export default sectorController;

