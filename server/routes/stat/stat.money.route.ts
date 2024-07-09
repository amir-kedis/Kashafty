import { Router } from "express";

const moneyRouter = Router();

// TODO: add controller when made
moneyRouter.get("/total", () => {});
moneyRouter.get("/spent", () => {});
moneyRouter.get("/income", () => {});
moneyRouter.get("/current-week-subscription", () => {});
moneyRouter.get("/line-chart", () => {});
moneyRouter.get("/income-expense-chart", () => {});
moneyRouter.get("subscription-line-chart", () => {});

export default moneyRouter;
