import { Router } from "express";
import statsController from "../controllers/stats.controller";
import { getCurrentWeekMiddleware } from "../middlewares/current.middleware";
import checkRankMiddleware from "../middlewares/checkRank.middleware";
const statsRouter = Router();

// Detailed stats
statsRouter.get(
  "/scouts/graph",
  checkRankMiddleware("general"),
  getCurrentWeekMiddleware,
  statsController.getAllScoutsAbsenceRateGraph,
);
statsRouter.get(
  "/scouts/graph/unit/:unitCaptainId",
  checkRankMiddleware("general", "unit"),
  getCurrentWeekMiddleware,
  statsController.getScoutsInUnitAbsenceRateGraph,
);
statsRouter.get(
  "/scouts/graph/sector",
  getCurrentWeekMiddleware,
  statsController.getScoutsInSectorAbsenceRateGraph,
);

// General stats
statsRouter.get(
  "/scouts",
  checkRankMiddleware("general"),
  getCurrentWeekMiddleware,
  statsController.getAllScoutsAbsenceRate,
);
statsRouter.get(
  "/scouts/unit/:unitCaptainId",
  checkRankMiddleware("general", "unit"),
  getCurrentWeekMiddleware,
  statsController.getScoutsInUnitAbsenceRate,
);
statsRouter.get(
  "/scouts/sector",
  getCurrentWeekMiddleware,
  statsController.getScoutsInSectorAbsenceRate,
);
statsRouter.get(
  "/scouts/:scoutId",
  getCurrentWeekMiddleware,
  statsController.getScoutAbsenceRate,
);

export default statsRouter;
