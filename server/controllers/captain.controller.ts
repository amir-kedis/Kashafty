import { Request, Response } from "express";
import { prisma } from "../database/db";
import { Captain } from "@prisma/client";
import asyncDec from "../utils/asyncDec";
import AppError from "../utils/AppError";

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

  let result: Captain[] = await prisma.captain.findMany();


  //TODO: Performance issue, consider using prisma query to filter the data
  if (type) {
    result = result.filter((captain) => captain.type === type);
  }

  return res.status(200).json({
    message: "Successful retrieval",
    body: result,
    count: result.length,
  });
}

async function getCaptainsInSector(req: GetCaptainsInSectorRequest, res: Response) {
  const { baseName, suffixName } = req.query;

  const result = await prisma.captain.findMany({
    where: {
      rSectorBaseName: baseName,
      rSectorSuffixName: suffixName,
    },
  });

  return res.status(200).json({
    message: "Successful retrieval",
    body: result,
    count: result.length,
  });
}

async function getCaptainsInUnit(req: GetCaptainsInUnitRequest, res: Response) {
  
  const { unitCaptainId } = req.params;

  // NOTE: left as a ref remove after the testing the below todo
  // const result = await db.query(
  //   `SELECT C.*
  //    FROM "Captain" AS C, "Sector" AS S
  //    WHERE S."unitCaptainId" = $1 AND
  //          C."rSectorBaseName" = S."baseName" AND
  //          C."rSectorSuffixName" = S."suffixName";`,
  //   [unitCaptainId],
  // );

  // TODO: this needs testing
  console.log(unitCaptainId);

  // TODO: what if UnitCaptainId is not found 

  const result = await prisma.captain.findMany({
    where: {
      Sector_Sector_unitCaptainIdToCaptain: {
        some: {
          unitCaptainId: parseInt(unitCaptainId),
        },
      },
    },
    include: {
      Sector_Sector_unitCaptainIdToCaptain: true,
    },
  });

  res.status(200).json({
    message: "Successful retrieval",
    body: result,
    count: result.length,
  });

}

async function getCaptain(req: GetCaptainRequest, res: Response) {

  const { captainId } = req.params;

  const result = await prisma.captain.findUnique({
    where: {
      captainId: parseInt(captainId),
    },
  });

  if (!result) {
    throw new AppError(404, "Captain not found", "الكابتن غير موجود");
  }

  res.status(200).json({
    message: "Successful retrieval",
    body: result,
  });
}

// @desc    Update a captain type
// @route   PATCH /api/captain/change/type/:id
// @access  Private

async function setCaptainType(req: Request, res: Response){

  const { captainId } = req.params;
  const { type } = req.body;

  if (!captainId) {
    throw new AppError(400, "Please enter a valid id", "من فضلك أدخل رقم كابتن صحيح");
  }

  if (type !== "regular" && type !== "unit" && type !== "general") {
    throw new AppError(400, "Please enter a valid captain type", "من فضلك أدخل نوع كابتن صحيح");
  }

  const result = await prisma.captain.update({
    where: {
      captainId: parseInt(captainId),
    },
    data: {
      type,
    },
  });

  res.status(200).json({
    message: "Successful update",
    body: result,
  });


}

const captainController = {
  getAllCaptains: asyncDec(getAllCaptains),
  getCaptainsInSector: asyncDec(getCaptainsInSector),
  getCaptainsInUnit: asyncDec(getCaptainsInUnit),
  getCaptain: asyncDec(getCaptain),
  setCaptainType: asyncDec(setCaptainType),
};

export default captainController;
