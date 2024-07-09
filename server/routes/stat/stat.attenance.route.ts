import { Router } from "express";

import statAttendanceController from "../../controllers/stat/stat.attendance.controller";
import { getCurrentWeekMiddleware } from "../../middlewares/current.middleware";

const attendanceRouter = Router();

// TODO: call the controller when made
attendanceRouter.get("/rate", statAttendanceController.getAttendanceRate);
attendanceRouter.get(
  "/line-chart",
  getCurrentWeekMiddleware,
  statAttendanceController.getAttendanceLineChart,
);
attendanceRouter.get("/stacked-line-chart", () => {});
attendanceRouter.get("/scout", () => {});

export default attendanceRouter;
