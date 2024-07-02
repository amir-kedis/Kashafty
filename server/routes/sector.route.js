import { Router } from "express";
import sectorController from "../controllers/sector.controller.js";

const sectorRouter = Router();

sectorRouter.get("/all", sectorController.getAllSectors);
sectorRouter.post("/", sectorController.insertSector);
sectorRouter.get("/", sectorController.getSector);
sectorRouter.patch("/unit", sectorController.setUnitCaptain);
sectorRouter.patch("/captain/assign", sectorController.assignCaptain);
sectorRouter.get("/:unitCaptainId", sectorController.getAllSectorsInUnit);

export default sectorRouter;
