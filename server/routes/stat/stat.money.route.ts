import { Router } from "express";

const moneyRouter = Router();

// TODO: add controller when made
moneyRouter.use("/total", () => {});
moneyRouter.use("/spent", () => {});
moneyRouter.use("/income", () => {});
moneyRouter.use("/current-week-subscription", () => {});
moneyRouter.use("/line-chart", () => {});
moneyRouter.use("/income-expense-chart", () => {});
moneyRouter.use("subscription-line-chart", () => {});

export default moneyRouter;
