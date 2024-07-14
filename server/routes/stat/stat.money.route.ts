import { Router } from "express";
import statMoneyController from "../../controllers/stat/stat.money.controller";

const moneyRouter = Router();

// TODO: add controller when made
moneyRouter.get("/total", statMoneyController.getTotalMoney);
moneyRouter.get("/spent", statMoneyController.getTotalExpense);
moneyRouter.get("/income", statMoneyController.getTotalIncome);
moneyRouter.get(
  "/current-week-subscription",
  statMoneyController.getCurrentWeekSubscription,
);
moneyRouter.get("/line-chart", () => {});
moneyRouter.get("/income-expense-chart", () => {});
moneyRouter.get("/subscription-line-chart", () => {});

export default moneyRouter;
