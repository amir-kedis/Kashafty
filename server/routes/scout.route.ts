import { Router } from "express";
import scoutController from "../controllers/scout.controller";
import { isGeneralOrUnitCaptain } from "../middlewares/auth.middleware";

const scoutRouter = Router();

scoutRouter.post("/", scoutController.insertScout);
scoutRouter.get("/:scoutId", scoutController.getScout);
scoutRouter.put("/:scoutId", scoutController.updateScout);
scoutRouter.delete(
  "/:scoutId",
  isGeneralOrUnitCaptain,
  scoutController.deleteScout
);
scoutRouter.patch("/:scoutId", scoutController.unexpelScout);
scoutRouter.get("/", scoutController.getAllScouts);
scoutRouter.get("/unit/:unitCaptainId", scoutController.getScoutsInUnit);
scoutRouter.get("/sector/all", scoutController.getScoutsInSector);
scoutRouter.get(
  "/sector/attendance",
  scoutController.getScoutsBySectorWithAttendance
);

export default scoutRouter;
