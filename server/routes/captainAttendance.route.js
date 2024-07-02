import { Router } from "express";
import captainAttendanceController from "../controllers/captainAttendance.controller.js";

const captainAttendanceRouter = Router();

// Insert a new attendance for a captain
captainAttendanceRouter.post("/", captainAttendanceController.upsertAttendance);
captainAttendanceRouter.get(
  "/sector/all",
  captainAttendanceController.getSectorAttendance,
);
captainAttendanceRouter.get(
  "/unit/all",
  captainAttendanceController.getUnitAttendance,
);
captainAttendanceRouter.get(
  "/:captainId/:weekNumber/:termNumber",
  captainAttendanceController.getCaptainAttendance,
);

export default captainAttendanceRouter;

