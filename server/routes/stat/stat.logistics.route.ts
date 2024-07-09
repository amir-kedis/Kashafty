import { Router } from "express";

const logisticsRouter = Router();

// TODO: add controller when made
logisticsRouter.use("/scouts", () => {});
logisticsRouter.use("/captains", () => {});
logisticsRouter.use("/sectors", () => {});
logisticsRouter.use("/scout-gender-distribution", () => {});
logisticsRouter.use("/captain-gender-distribution", () => {});
logisticsRouter.use("/sector-counts", () => {});

export default logisticsRouter;
