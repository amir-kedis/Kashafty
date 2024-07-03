import { Request, Response } from "express";
import db from "../database/db";

interface GetSubscriptionRequest extends Request {
  query: {
    sectorBaseName: string;
    sectorSuffixName: string;
    weekNumber: string;
    termNumber: string;
  };
}

const financeController = {
  // @desc    Get a budget
  // @route   GET /api/finance/budget
  // @access  Private
  getBudget: async (_: Request, res: Response) => {
    try {
      // get income
      let result = await db.query(
        `SELECT COALESCE(SUM(value), 0) AS sum FROM "FinanceItem"
                WHERE "type" = 'income';`,
      );
      const income = result.rows[0].sum;

      // get expense
      result = await db.query(
        `SELECT COALESCE(SUM("value"), 0) AS sum FROM "FinanceItem"
                WHERE "type" = 'expense';`,
      );
      const expense = result.rows[0].sum;

      const budget = income - expense;
      res.status(200).json({
        message: "Get budget successfully",
        body: budget,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "An error occurred while getting the budget",
      });
    }
  },

  // @desc    Get income
  // @route   GET /api/finance/income
  // @access  Private
  getIncome: async (_: Request, res: Response) => {
    try {
      const result = await db.query(
        `SELECT * FROM "FinanceItem" AS F, "OtherItem" AS O
                WHERE F."itemId" = O."itemId" AND F."type" = 'income';`,
      );

      const subscriptionIncome = await db.query(
        `SELECT * FROM "FinanceItem" AS F , "Subscription" AS S
                WHERE F."itemId" = S."itemId";`,
      );
      const income = [...subscriptionIncome.rows, ...result.rows];

      res.status(200).json({
        message: "Get income successfully",
        body: income,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "An error occurred while getting the income",
      });
    }
  },

  // @desc    Get expense
  // @route   GET /api/finance/expense
  // @access  Private
  getExpense: async (_: Request, res: Response) => {
    try {
      const result = await db.query(
        `SELECT * FROM "FinanceItem" AS F , "OtherItem" AS O
                WHERE F."itemId"=O."itemId" AND "type" = 'expense';`,
      );
      const expense = result.rows;

      res.status(200).json({
        message: "Get expense successfully",
        body: expense,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "An error occurred while getting the expense",
      });
    }
  },

  // @desc    Add a subscription
  // @route   POST /api/finance/subscription
  // @access  Private
  addSubscription: async (req: Request, res: Response) => {
    try {
      const {
        value,
        sectorBaseName,
        sectorSuffixName,
        termNumber,
        weekNumber,
      } = req.body as {
        value: number;
        sectorBaseName: string;
        sectorSuffixName: string;
        termNumber: string;
        weekNumber: string;
      };

      let result = await db.query(
        `SELECT "itemId" AS id
                FROM "Subscription"
                WHERE "sectorBaseName" = $1 AND "sectorSuffixName" = $2 AND "termNumber" = $3 AND "weekNumber" = $4;`,
        [sectorBaseName, sectorSuffixName, termNumber, weekNumber],
      );

      if (!result.rowCount) {
        result = await db.query(
          `INSERT INTO "FinanceItem" ("value", "timestamp", "type")
                    VALUES ($1, NOW(), 'income') RETURNING *;`,
          [value],
        );
      } else {
        result = await db.query(
          `UPDATE "FinanceItem"
                    SET "value"=$1, "timestamp"=NOW()
                    WHERE "itemId"=$2 RETURNING *;`,
          [value, result.rows[0].id],
        );
      }

      const financeItem = result.rows[0];

      result = await db.query(
        `INSERT INTO "Subscription" ("itemId", "sectorBaseName", "sectorSuffixName", "weekNumber", "termNumber")
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT ("itemId") DO UPDATE
                SET "sectorBaseName" = $2, "sectorSuffixName" = $3, "weekNumber" = $4, "termNumber" = $5
                RETURNING *;`,
        [
          financeItem.itemId,
          sectorBaseName,
          sectorSuffixName,
          weekNumber,
          termNumber,
        ],
      );

      const subscription = result.rows[0];

      res.status(200).json({
        message: "Add subscription successfully",
        body: { financeItem: financeItem, subscription: subscription },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "An error occurred while adding subscription",
      });
    }
  },

  // @desc    Get a subscription
  // @route   GET /api/finance/subscription
  // @access  Private
  getSubscription: async (req: GetSubscriptionRequest, res: Response) => {
    try {
      const { sectorBaseName, sectorSuffixName, weekNumber, termNumber } =
        req.query;

      const result = await db.query(
        `SELECT F."value"
                FROM "Subscription" AS S, "FinanceItem" AS F
                WHERE S."itemId" = F."itemId" AND
                "sectorBaseName" = $1 AND "sectorSuffixName" = $2 AND
                "weekNumber" = $3 AND "termNumber" = $4;`,
        [sectorBaseName, sectorSuffixName, weekNumber, termNumber],
      );
      const subscription = result.rows[0].value;

      res.status(200).json({
        message: "Get subscription successfully",
        body: subscription,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "An error occurred while getting the subscription",
      });
    }
  },

  // @desc    Get all subscriptions of current week
  // @route   GET /api/finance/subscription/all
  // @access  Private
  getAllSubscriptionsOfCurrentWeek: async (req: any, res: Response) => {
    try {
      const result = await db.query(
        `SELECT COALESCE(SUM(F."value"), 0) AS sum
                FROM "Subscription" AS S, "FinanceItem" AS F
                WHERE S."itemId" = F."itemId" AND
                S."termNumber" = $1 AND
                S."weekNumber" = $2;`,
        [req.currentWeek.termNumber, req.currentWeek.weekNumber],
      );
      const subscription = result.rows[0].sum;

      res.status(200).json({
        message: "Get subscription successfully",
        body: subscription,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "An error occurred while getting the subscription",
      });
    }
  },

  // @desc    Add an other item
  // @route   POST /api/finance/otherItem
  // @access  Private
  addOtherItem: async (req: Request, res: Response) => {
    try {
      const { value, type, description } = req.body as {
        value: number;
        type: string;
        description: string;
      };

      let result = await db.query(
        `INSERT INTO "FinanceItem" ("value", "timestamp", "type")
                VALUES ($1, NOW(), $2) RETURNING *;`,
        [value, type],
      );

      const financeItem = result.rows[0];

      result = await db.query(
        `INSERT INTO "OtherItem" ("description", "itemId", "generalCaptainId")
                VALUES ($1, $2, $3) RETURNING *;`,
        [description, financeItem.itemId, req.captain?.captainId],
      );

      const otherItem = result.rows[0];

      res.status(200).json({
        message: "Add other item successfully",
        body: { financeItem: financeItem, otherItem: otherItem },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "An error occurred while adding other item",
      });
    }
  },
};

export default financeController;
