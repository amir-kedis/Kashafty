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

import authMiddleware from "../../middlewares/auth.middleware";
import attendanceRouter from "./stat.attenance.route";
import moneyRouter from "./stat.money.route";
import logisticsRouter from "./stat.logistics.route";
import { getCurrentTermMiddleware } from "../../middlewares/current.middleware";

const statRouter = Router();

statRouter.use("/attendance", getCurrentTermMiddleware, attendanceRouter);
statRouter.use("/money", authMiddleware, moneyRouter);
statRouter.use("/logistics", logisticsRouter);

export default statRouter;