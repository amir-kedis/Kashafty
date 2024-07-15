import { Router } from "express";
import statLogisticsController from "../../controllers/stat/stat.logistics.controller";

const logisticsRouter = Router();

logisticsRouter.get("/scouts", statLogisticsController.getTotalScouts);
logisticsRouter.get("/captains", statLogisticsController.getTotalCaptains);
logisticsRouter.get("/sectors", statLogisticsController.getTotalSectors);
logisticsRouter.get(
  "/scout-gender-distribution",
  statLogisticsController.getScoutGenderDistribution,
);
logisticsRouter.get(
  "/captain-gender-distribution",
  statLogisticsController.getCaptainGenderDistribution,
);
logisticsRouter.get("/sector-counts", statLogisticsController.getSectorCounts);

export default logisticsRouter;
