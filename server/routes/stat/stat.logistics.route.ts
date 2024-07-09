import { Router } from "express";

const logisticsRouter = Router();

// TODO: add controller when made
logisticsRouter.get("/scouts", () => {});
logisticsRouter.get("/captains", () => {});
logisticsRouter.get("/sectors", () => {});
logisticsRouter.get("/scout-gender-distribution", () => {});
logisticsRouter.get("/captain-gender-distribution", () => {});
logisticsRouter.get("/sector-counts", () => {});

export default logisticsRouter;
