import { Router } from "express";
import cronController from "../controllers/cron.controller";

const cronRouter = Router();

cronRouter.post("/week", cronController.createMissingWeeks);

cronRouter.post(
  "/attendance/scout",
  cronController.sendScoutsAbsenceNotification,
);

cronRouter.post(
  "/attendance/captain",
  cronController.sendCaptainsAbsenceNotification,
);

export default cronRouter;
