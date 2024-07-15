import { Router } from "express";
import statMoneyController from "../../controllers/stat/stat.money.controller";

const moneyRouter = Router();

moneyRouter.get("/total", statMoneyController.getTotalMoney);
moneyRouter.get("/spent", statMoneyController.getTotalExpense);
moneyRouter.get("/income", statMoneyController.getTotalIncome);
moneyRouter.get(
  "/current-week-subscription",
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
