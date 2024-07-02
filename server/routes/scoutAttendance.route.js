import { Router } from "express";
import scoutAttendanceController from "../controllers/scoutAttendance.controller.js";

const scoutAttendanceRouter = Router();

// Insert a new attendance for a scout
scoutAttendanceRouter.post("/", scoutAttendanceController.upsertAttendance);
scoutAttendanceRouter.get(
  "/sector/all",
  scoutAttendanceController.getSectorAttendance,
);
scoutAttendanceRouter.get(
  "/:scoutId/:weekNumber/:termNumber",
  scoutAttendanceController.getScoutAttendance,
);

export default scoutAttendanceRouter;

