import { Router } from "express";
import alertController from "../controllers/alert.controller";

const alertRouter = Router();

alertRouter.post("/", alertController.createAlert);
alertRouter.get("/all", alertController.getAllAlerts);
alertRouter.get("/:id", alertController.getAlert);
alertRouter.post("/:id", alertController.sendAlert);
alertRouter.delete("/:id", alertController.deleteAlert);
alertRouter.patch("/:id", alertController.updateStatus);

export default alertRouter;
