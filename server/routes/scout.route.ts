import { Router } from "express";
import scoutController from "../controllers/scout.controller";

const scoutRouter = Router();

scoutRouter.post("/", scoutController.insertScout);
scoutRouter.get("/:scoutId", scoutController.getScout);
scoutRouter.put("/:scoutId", scoutController.updateScout);
scoutRouter.get("/", scoutController.getAllScouts);
scoutRouter.get("/unit/:unitCaptainId", scoutController.getScoutsInUnit);
scoutRouter.get("/sector/all", scoutController.getScoutsInSector);

export default scoutRouter;
