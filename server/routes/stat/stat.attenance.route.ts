import { Router } from "express";

const attendanceRouter = Router();

// TODO: call the controller when made
attendanceRouter.use("/rate", () => {});
attendanceRouter.use("/line-chart", () => {});
attendanceRouter.use("/stacked-line-chart", () => {});
attendanceRouter.use("/scout", () => {});

export default attendanceRouter;
