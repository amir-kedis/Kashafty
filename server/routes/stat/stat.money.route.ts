import { Router } from "express";
import statMoneyController from "../../controllers/stat/stat.money.controller";
import { getCurrentWeekMiddleware } from "../../middlewares/current.middleware";

const moneyRouter = Router();

moneyRouter.get("/total", statMoneyController.getTotalMoney);
moneyRouter.get("/spent", statMoneyController.getTotalExpense);
moneyRouter.get("/income", statMoneyController.getTotalIncome);
moneyRouter.get(
  "/current-week-subscription",
  getCurrentWeekMiddleware,
  statMoneyController.getCurrentWeekSubscription,
);
moneyRouter.get("/line-chart", statMoneyController.getMoneyLineChart);
moneyRouter.get(
  "/income-expense-chart",
  statMoneyController.getIncomeExpenseStackedChart,
);
moneyRouter.get(
  "/subscription-line-chart",
  statMoneyController.getSubscriptionLineChart,
);

export default moneyRouter;
