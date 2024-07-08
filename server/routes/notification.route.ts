import { Router } from "express";
import notificationController from "../controllers/notification.controller";

const notificationRouter = Router();

notificationRouter.post("/", notificationController.sendNotification);
notificationRouter.get("/", notificationController.getNotification);
notificationRouter.patch("/", notificationController.updateNotification);
notificationRouter.delete("/", notificationController.deleteNotification);

export default notificationRouter;
