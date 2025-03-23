import { Router } from "express";
import captainController from "../controllers/captain.controller";

const captainRouter = Router();

captainRouter.get("/", captainController.getAllCaptains);
captainRouter.get("/unit/:unitCaptainId", captainController.getCaptainsInUnit);
captainRouter.get("/sector/all", captainController.getCaptainsInSector);
captainRouter.get("/sector", captainController.getCaptainsBySector);
captainRouter.get("/:captainId", captainController.getCaptain);
captainRouter.patch("/:captainId", captainController.setCaptainType);


export default captainRouter;
