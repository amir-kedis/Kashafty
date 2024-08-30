/* ============================================================================
 *
 *
 *  ███████╗████████╗ █████╗ ████████╗
 *  ██╔════╝╚══██╔══╝██╔══██╗╚══██╔══╝
 *  ███████╗   ██║   ███████║   ██║
 *  ╚════██║   ██║   ██╔══██║   ██║
 *  ███████║   ██║   ██║  ██║   ██║
 *  ╚══════╝   ╚═╝   ╚═╝  ╚═╝   ╚═╝
 *
 *
 *  New Statistics system.
 *
 *  Author: Amir Kedis.
 *
 * ==========================================================================*/
import { Router } from "express";

import attendanceRouter from "./stat.attenance.route";
import moneyRouter from "./stat.money.route";
import logisticsRouter from "./stat.logistics.route";
import { getCurrentTermMiddleware } from "../../middlewares/current.middleware";
import passport from "passport";

const statRouter = Router();

statRouter.use("/attendance", getCurrentTermMiddleware, attendanceRouter);
statRouter.use(
  "/money",
  passport.authenticate("jwt", { session: false }),
  moneyRouter,
);
statRouter.use("/logistics", logisticsRouter);

export default statRouter;
