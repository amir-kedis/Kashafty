import { Router } from "express";
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
import passport from "passport";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
// TODO: this is the old stat endpoints, delete later
apiRouter.use("/stats", statsRouter);
// NOTE: this is the new stat endpoints
apiRouter.use("/stat", statRouter);
apiRouter.use(
  "/finance",
  passport.authenticate("jwt", { session: false }),
  financeRouter,
);
apiRouter.use(
  "/term",
  passport.authenticate("jwt", { session: false }),

  termRouter,
);
apiRouter.use(
  "/captain",
  passport.authenticate("jwt", { session: false }),
  captainRouter,
);
apiRouter.use(
  "/notification",
  passport.authenticate("jwt", { session: false }),
  notificationController,
);
apiRouter.use(
  "/scout",
  passport.authenticate("jwt", { session: false }),

  scoutRouter,
);
apiRouter.use(
  "/sector",
  passport.authenticate("jwt", { session: false }),
  sectorRouter,
);
apiRouter.use(
  "/scoutAttendance",
  passport.authenticate("jwt", { session: false }),
  scoutAttendanceRouter,
);
apiRouter.use(
  "/captainAttendance",
  passport.authenticate("jwt", { session: false }),

  captainAttendanceRouter,
);
apiRouter.use("/activities", activitiesRouter);
apiRouter.use("/cron", cronRouter);

export default apiRouter;
