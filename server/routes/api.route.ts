import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import authRouter from "./auth.route";
import statsRouter from "./stats.route";
import financeRouter from "./finance.route";
import termRouter from "./term.route";
import captainRouter from "./captain.route";
import alertRouter from "./alert.route";
import scoutRouter from "./scout.route";
import sectorRouter from "./sector.route";
import scoutAttendanceRouter from "./scoutAttendance.route";
import captainAttendanceRouter from "./captainAttendance.route";
import activitiesRouter from "./activities.route";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/stats", authMiddleware, statsRouter);
apiRouter.use("/finance", authMiddleware, financeRouter);
apiRouter.use("/term", authMiddleware, termRouter);
apiRouter.use("/captain", authMiddleware, captainRouter);
apiRouter.use("/alert", authMiddleware, alertRouter);
apiRouter.use("/scout", authMiddleware, scoutRouter);
apiRouter.use("/sector", authMiddleware, sectorRouter);
apiRouter.use("/scoutAttendance", authMiddleware, scoutAttendanceRouter);
apiRouter.use("/captainAttendance", authMiddleware, captainAttendanceRouter);
apiRouter.use("/activities", activitiesRouter);

export default apiRouter;
