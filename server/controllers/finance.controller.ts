import { Request, Response } from "express";
import { prisma } from "../database/db";

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
      const incomeAgg = await prisma.financeItem.aggregate({
        _sum: {
          value: true,
        },
        where: {
          type: "income",
        },
      });
      const income = incomeAgg._sum.value || 0;

      // get expense
      const expenseAgg = await prisma.financeItem.aggregate({
        _sum: {
          value: true,
        },
        where: {
          type: "expense",
        },
      });
      const expense = expenseAgg._sum.value || 0;

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
      const result = await prisma.financeItem.findMany({
        where: {
          type: "income",
        },
        include: {
          OtherItem: true,
        },
      });

      const income = result;

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
      const expenses = await prisma.financeItem.findMany({
        where: {
          type: "expense",
        },
        include: {
          OtherItem: true,
        },
      });

      res.status(200).json({
        message: "Get expense successfully",
        body: expenses,
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

      // let result = await db.query(
      //   `SELECT "itemId" AS id
      //           FROM "Subscription"
      //           WHERE "sectorBaseName" = $1 AND "sectorSuffixName" = $2 AND "termNumber" = $3 AND "weekNumber" = $4;`,
      //   [sectorBaseName, sectorSuffixName, termNumber, weekNumber],
      // );

      let subscr = await prisma.subscription.findFirst({
        where: {
          sectorBaseName: sectorBaseName,
          sectorSuffixName: sectorSuffixName,
          weekNumber: parseInt(weekNumber),
          termNumber: parseInt(termNumber),
        },
      });

      let result: any;

      if (!subscr) {
        result = await prisma.financeItem.create({
          data: {
            value: value,
            type: "income",
            timestamp: new Date(),
          },
        });
      } else {
        result = await prisma.financeItem.update({
          where: {
            itemId: subscr.itemId,
          },
          data: {
            value: value,
            timestamp: new Date(),
          },
        });
      }

      const financeItem = result;

      result = await prisma.subscription.upsert({
        where: {
          itemId: financeItem.itemId,
        },
        update: {
          sectorBaseName: sectorBaseName,
          sectorSuffixName: sectorSuffixName,
          weekNumber: parseInt(weekNumber),
          termNumber: parseInt(termNumber),
        },
        create: {
          itemId: financeItem.itemId,
          sectorBaseName: sectorBaseName,
          sectorSuffixName: sectorSuffixName,
          weekNumber: parseInt(weekNumber),
          termNumber: parseInt(termNumber),
        },
      });

      const subscription = result;

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

      const subscription = await prisma.subscription.findFirst({
        where: {
          sectorBaseName: sectorBaseName,
          sectorSuffixName: sectorSuffixName,
          weekNumber: parseInt(weekNumber),
          termNumber: parseInt(termNumber),
        },
        include: {
          FinanceItem: true,
        },
      });

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
      const subscription = await prisma.subscription.findMany({
        where: {
          termNumber: req.currentWeek.termNumber,
          weekNumber: req.currentWeek.weekNumber,
        },
        include: {
          FinanceItem: true,
        },
      });

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

      const financeItem = await prisma.financeItem.create({
        data: {
          value: value,
          type: type as "income" | "expense",
          timestamp: new Date(),
        },
      });
      const otherItem = await prisma.otherItem.create({
        data: {
          description: description,
          itemId: financeItem.itemId,
        },
      });

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
