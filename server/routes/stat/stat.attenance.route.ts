import { Router } from "express";

import statAttendanceController from "../../controllers/stat/stat.attendance.controller";
import { getCurrentWeekMiddleware } from "../../middlewares/current.middleware";

const attendanceRouter = Router();

attendanceRouter.get("/rate", statAttendanceController.getAttendanceRate);
attendanceRouter.get(
  "/line-chart",
  getCurrentWeekMiddleware,
  statAttendanceController.getAttendanceLineChart,
);
attendanceRouter.get(
  "/stacked-line-chart",
  getCurrentWeekMiddleware,
  statAttendanceController.getAttendanceStackLineChart,
);
attendanceRouter.get("/scout", statAttendanceController.getScoutAttendanceRate);

export default attendanceRouter;
