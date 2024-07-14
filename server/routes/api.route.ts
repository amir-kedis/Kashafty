import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import authRouter from "./auth.route";
import statsRouter from "./stats.route";
import financeRouter from "./finance.route";
import termRouter from "./term.route";
import captainRouter from "./captain.route";
import notificationController from "./notification.route";
import scoutRouter from "./scout.route";
import sectorRouter from "./sector.route";
import scoutAttendanceRouter from "./scoutAttendance.route";
import captainAttendanceRouter from "./captainAttendance.route";
import activitiesRouter from "./activities.route";
import statRouter from "./stat/stat.route";
import cronRouter from "./cron.route";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/stats", authMiddleware, statsRouter);
// NOTE: this is the new stat endpoints
apiRouter.use("/stat", statRouter);
apiRouter.use("/finance", authMiddleware, financeRouter);
apiRouter.use("/term", authMiddleware, termRouter);
apiRouter.use("/captain", authMiddleware, captainRouter);
apiRouter.use("/notification", authMiddleware, notificationController);
apiRouter.use("/scout", authMiddleware, scoutRouter);
apiRouter.use("/sector", authMiddleware, sectorRouter);
apiRouter.use("/scoutAttendance", authMiddleware, scoutAttendanceRouter);
apiRouter.use("/captainAttendance", authMiddleware, captainAttendanceRouter);
apiRouter.use("/activities", activitiesRouter);
apiRouter.use("/cron", cronRouter);

export default apiRouter;
