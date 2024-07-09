import { Router } from "express";

import statAttendanceController from "../../controllers/stat/stat.attendance.controller";

const attendanceRouter = Router();

// TODO: call the controller when made
attendanceRouter.get("/rate", statAttendanceController.getAttendanceRate);
attendanceRouter.get("/line-chart", () => {});
attendanceRouter.get("/stacked-line-chart", () => {});
attendanceRouter.get("/scout", () => {});

export default attendanceRouter;
