/*==================================================================================================
 *
 *
 *    ██╗      ██████╗  ██████╗ ██╗███████╗████████╗██╗ ██████╗███████╗
 *    ██║     ██╔═══██╗██╔════╝ ██║██╔════╝╚══██╔══╝██║██╔════╝██╔════╝
 *    ██║     ██║   ██║██║  ███╗██║███████╗   ██║   ██║██║     ███████╗
 *    ██║     ██║   ██║██║   ██║██║╚════██║   ██║   ██║██║     ╚════██║
 *    ███████╗╚██████╔╝╚██████╔╝██║███████║   ██║   ██║╚██████╗███████║
 *    ╚══════╝ ╚═════╝  ╚═════╝ ╚═╝╚══════╝   ╚═╝   ╚═╝ ╚═════╝╚══════╝
 *
 *    Stat Logistics Controller
 *    handles all statistics related to logistics
 *
 *    Author: Amir Kedis
 *
 *==================================================================================================*/

import { Request, Response } from "express";
import { prisma } from "../../database/db";
import AppError from "../../utils/AppError";
import asyncDec from "../../utils/asyncDec";

async function getTotalScouts(req: Request, res: Response) {
  const { sector, unit } = req.query;
  const whereClause: any = {};

  if (sector) whereClause.sector = sector;
  if (unit) whereClause.unit = unit;

  const totalScouts = await prisma.scout.count({ where: whereClause });

  return res.status(200).json({
    message: "تم استرجاع العدد الإجمالي للكشافة بنجاح.",
    totalScouts: totalScouts,
  });
}

async function getTotalCaptains(req: Request, res: Response) {
  const { sector, unit } = req.query;
  const whereClause: any = {};

  if (sector) whereClause.sector = sector;
  if (unit) whereClause.unit = unit;

  const totalCaptains = await prisma.captain.count({ where: whereClause });

  return res.status(200).json({
    message: "تم استرجاع العدد الإجمالي للقادة بنجاح.",
    totalCaptains: totalCaptains,
  });
}

async function getTotalSectors(req: Request, res: Response) {
  const totalSectors = await prisma.sector.count();

  return res.status(200).json({
    message: "تم استرجاع العدد الإجمالي للقطاعات بنجاح.",
    totalSectors: totalSectors,
  });
}

async function getScoutGenderDistribution(req: Request, res: Response) {
  const maleCount = await prisma.scout.count({ where: { gender: "male" } });
  const femaleCount = await prisma.scout.count({ where: { gender: "female" } });

  const totalScouts = maleCount + femaleCount;
  const maleRatio = (maleCount / totalScouts) * 100;
  const femaleRatio = (femaleCount / totalScouts) * 100;

  return res.status(200).json({
    message: "تم استرجاع توزيع الجنس للكشافة بنجاح.",
    maleRatio: maleRatio,
    femaleRatio: femaleRatio,
  });
}

async function getCaptainGenderDistribution(req: Request, res: Response) {
  const maleCount = await prisma.captain.count({ where: { gender: "male" } });
  const femaleCount = await prisma.captain.count({ where: { gender: "female" } });

  const totalCaptains = maleCount + femaleCount;
  const maleRatio = (maleCount / totalCaptains) * 100;
  const femaleRatio = (femaleCount / totalCaptains) * 100;

  return res.status(200).json({
    message: "تم استرجاع توزيع الجنس للقادة بنجاح.",
    maleRatio: maleRatio,
    femaleRatio: femaleRatio,
  });
}

async function getSectorCounts(req: Request, res: Response) {
  const sectors = await prisma.sector.findMany({
    include: { _count: { select: { Scout: true } } },
  });

  const sectorCounts = sectors.map((sector) => ({
    sectorName: sector.baseName + " " + sector.suffixName,
    scoutCount: sector._count.Scout,
  }));

  return res.status(200).json({
    message: "تم استرجاع عدد الكشافة في القطاعات بنجاح.",
    sectorCounts: sectorCounts,
  });
}

const statLogisticsController = {
  getTotalScouts: asyncDec(getTotalScouts),
  getTotalCaptains: asyncDec(getTotalCaptains),
  getTotalSectors: asyncDec(getTotalSectors),
  getScoutGenderDistribution: asyncDec(getScoutGenderDistribution),
  getCaptainGenderDistribution: asyncDec(getCaptainGenderDistribution),
  getSectorCounts: asyncDec(getSectorCounts),
};

export default statLogisticsController;
