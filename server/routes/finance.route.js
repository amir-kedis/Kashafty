import { Router } from "express";
import financeController from "../controllers/finance.controller.js";
import { getCurrentWeekMiddleware } from "../middlewares/current.middleware.js";
const financeRouter = Router();

financeRouter.get("/", financeController.getBudget);
financeRouter.get("/income", financeController.getIncome);
financeRouter.get("/expense", financeController.getExpense);
financeRouter.get("/subscription", financeController.getSubscription);
financeRouter.get(
  "/subscription/all",
  getCurrentWeekMiddleware,
  financeController.getAllSubscriptionsOfCurrentWeek,
);
financeRouter.post("/subscription", financeController.addSubscription);
financeRouter.post("/otherItem", financeController.addOtherItem);

export default financeRouter;
