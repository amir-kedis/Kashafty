import { Router } from "express";
import activitiesController from "../controllers/activities.controller";

const activitiesRouter = Router();

activitiesRouter.post("/", activitiesController.insertActivity);
activitiesRouter.get("/all", activitiesController.getAllActivities);

export default activitiesRouter;

