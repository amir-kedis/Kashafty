import { Router } from "express";
import financeController from "../controllers/finance.controller";
import { getCurrentWeekMiddleware } from "../middlewares/current.middleware";
const financeRouter = Router();

financeRouter.get("/", financeController.getBudget);
financeRouter.get("/all", financeController.getAllItems);
financeRouter.get("/income", financeController.getIncome);
financeRouter.get("/expense", financeController.getExpense);
financeRouter.get(
  "/subscription",
  getCurrentWeekMiddleware,
  financeController.getSubscription,
);
financeRouter.get(
  "/subscription/all",
  getCurrentWeekMiddleware,
  financeController.getAllSubscriptionsOfCurrentWeek,
);
financeRouter.post("/subscription", financeController.addSubscription);
financeRouter.post("/otherItem", financeController.addOtherItem);
financeRouter.delete("/item", financeController.deleteItem);

export default financeRouter;
