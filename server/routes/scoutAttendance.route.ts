import { Router } from "express";
import scoutAttendanceController from "../controllers/scoutAttendance.controller";

const scoutAttendanceRouter = Router();

// Insert a new attendance for a scout
scoutAttendanceRouter.post("/", scoutAttendanceController.upsertAttendance);
scoutAttendanceRouter.get('/scout/:scoutId/history', scoutAttendanceController.getScoutAttendanceHistory);
scoutAttendanceRouter.get('/scout/:scoutId/stats', scoutAttendanceController.getScoutAttendanceStats);

scoutAttendanceRouter.get(
  "/sector/all",
  scoutAttendanceController.getSectorAttendance,
);
scoutAttendanceRouter.get(
  "/:scoutId/:weekNumber/:termNumber",
  scoutAttendanceController.getScoutAttendance,
);

export default scoutAttendanceRouter;
