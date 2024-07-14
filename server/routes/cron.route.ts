import { Router } from "express";
import cronController from "../controllers/cron.controller";

const cronRouter = Router();

cronRouter.post("/week", cronController.createMissingWeeks);

export default cronRouter;
