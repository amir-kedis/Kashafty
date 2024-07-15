/*============================================================================
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
 *==========================================================================*/

import { Request, Response } from "express";
import { prisma } from "../../database/db";

const statLogisticsController = {
  /* getTotalScouts
   *
   * @desc  get the total count of scouts in a (sector/unit) or all
   * @endpoint GET /api/stat/logistics/scouts
   */
  getTotalScouts: async (req: Request, res: Response) => {
    try {
      const { sector, unit } = req.query;

      const whereClause: any = {};
      if (sector) whereClause.sector = sector;
      if (unit) whereClause.unit = unit;

      const totalScouts = await prisma.scout.count({
        where: whereClause,
      });

      res.status(200).json({
        message: "تم استرجاع العدد الإجمالي للكشافة بنجاح.",
        totalScouts: totalScouts,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "خطأ داخلي في الخادم" });
    }
  },

  /* getTotalCaptains
   *
   * @desc  get the total count of captains in a (sector/unit) or all
   * @endpoint GET /api/stat/logistics/captains
   */
  getTotalCaptains: async (req: Request, res: Response) => {
    try {
      const { sector, unit } = req.query;

      const whereClause: any = {};
      if (sector) whereClause.sector = sector;
      if (unit) whereClause.unit = unit;

      const totalCaptains = await prisma.captain.count({
        where: whereClause,
      });

      res.status(200).json({
        message: "تم استرجاع العدد الإجمالي للقادة بنجاح.",
        totalCaptains: totalCaptains,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "خطأ داخلي في الخادم" });
    }
  },

  /* getTotalSectors
   *
   * @desc  get the total count of sectors
   * @endpoint GET /api/stat/logistics/sectors
   */
  getTotalSectors: async (_req: Request, res: Response) => {
    try {
      const totalSectors = await prisma.sector.count();

      res.status(200).json({
        message: "تم استرجاع العدد الإجمالي للقطاعات بنجاح.",
        totalSectors: totalSectors,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "خطأ داخلي في الخادم" });
    }
  },

  /* getScoutGenderDistribution
   *
   * @desc  get the male ratio and female ratio of scouts
   * @endpoint GET /api/stat/logistics/scout-gender-distribution
   */
  getScoutGenderDistribution: async (_req: Request, res: Response) => {
    try {
      const maleCount = await prisma.scout.count({
        where: { gender: "male" },
      });

      const femaleCount = await prisma.scout.count({
        where: { gender: "female" },
      });

      const totalScouts = maleCount + femaleCount;
      const maleRatio = (maleCount / totalScouts) * 100;
      const femaleRatio = (femaleCount / totalScouts) * 100;

      res.status(200).json({
        message: "تم استرجاع توزيع الجنس للكشافة بنجاح.",
        maleRatio: maleRatio,
        femaleRatio: femaleRatio,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "خطأ داخلي في الخادم" });
    }
  },

  /* getCaptainGenderDistribution
   *
   * @desc  get the male ratio and female ratio of captains
   * @endpoint GET /api/stat/logistics/captain-gender-distribution
   */
  getCaptainGenderDistribution: async (_req: Request, res: Response) => {
    try {
      const maleCount = await prisma.captain.count({
        where: { gender: "male" },
      });

      const femaleCount = await prisma.captain.count({
        where: { gender: "female" },
      });

      const totalCaptains = maleCount + femaleCount;
      const maleRatio = (maleCount / totalCaptains) * 100;
      const femaleRatio = (femaleCount / totalCaptains) * 100;

      res.status(200).json({
        message: "تم استرجاع توزيع الجنس للقادة بنجاح.",
        maleRatio: maleRatio,
        femaleRatio: femaleRatio,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "خطأ داخلي في الخادم" });
    }
  },

  /* getSectorCounts
   *
   * @desc  get all sectors and their count of scouts
   * @endpoint GET /api/stat/logistics/sector-counts
   */
  getSectorCounts: async (_req: Request, res: Response) => {
    try {
      const sectors = await prisma.sector.findMany({
        include: {
          _count: {
            select: { Scout: true },
          },
        },
      });

      const sectorCounts = sectors.map((sector) => ({
        sectorName: sector.baseName + " " + sector.suffixName,
        scoutCount: sector._count.Scout,
      }));

      res.status(200).json({
        message: "تم استرجاع عدد الكشافة في القطاعات بنجاح.",
        sectorCounts: sectorCounts,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "خطأ داخلي في الخادم" });
    }
  },
};

export default statLogisticsController;
