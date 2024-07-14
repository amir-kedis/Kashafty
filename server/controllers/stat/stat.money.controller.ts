/*============================================================================
 *
 *
 *    ███╗   ███╗ ██████╗ ███╗   ██╗███████╗██╗   ██╗
 *    ████╗ ████║██╔═══██╗████╗  ██║██╔════╝╚██╗ ██╔╝
 *    ██╔████╔██║██║   ██║██╔██╗ ██║█████╗   ╚████╔╝
 *    ██║╚██╔╝██║██║   ██║██║╚██╗██║██╔══╝    ╚██╔╝
 *    ██║ ╚═╝ ██║╚██████╔╝██║ ╚████║███████╗   ██║
 *
 *    Stat Money Controller
 *    handles all statistics related to money
 *
 *    Author: Amir Kedis
 *
 *==========================================================================*/

import { Request, Response } from "express";
import { prisma } from "../../database/db";

const statMoneyController = {
  /* getTotalMoney
   *
   * @desc gets the total money in the bank
   * @endpoint GET /api/stat/money/total
   */
  getTotalMoney: async (_req: Request, res: Response) => {
    try {
      const income = await prisma.financeItem.aggregate({
        _sum: {
          value: true,
        },
        where: {
          type: "income",
        },
      });

      const expense = await prisma.financeItem.aggregate({
        _sum: {
          value: true,
        },
        where: {
          type: "expense",
        },
      });

      res.status(200).json({
        message: "retrived money successfully.",
        totalMoney: (income._sum.value ?? 0) - (expense._sum.value ?? 0),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  /* getTotalIncome
   *
   * @desc gets the total income
   * @endpoint GET /api/stat/money/income
   */
  getTotalIncome: async (_req: Request, res: Response) => {
    try {
      const income = await prisma.financeItem.aggregate({
        _sum: {
          value: true,
        },
        where: {
          type: "income",
        },
      });

      res.status(200).json({
        message: "retrived money successfully.",
        totalMoney: income._sum.value ?? 0,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  /* getTotalExpense
   *
   * @desc gets the total expense
   * @endpoint GET /api/stat/money/spent
   */
  getTotalExpense: async (_req: Request, res: Response) => {
    try {
      const expense = await prisma.financeItem.aggregate({
        _sum: {
          value: true,
        },
        where: {
          type: "expense",
        },
      });

      res.status(200).json({
        message: "retrived money successfully.",
        totalMoney: expense._sum.value ?? 0,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  /* getCurrentWeekSubscription
   *
   * @desc gets the current week subscription
   * @endpoint GET /api/stat/money/current-week-subscription
   */
  getCurrentWeekSubscription: async (_req: Request, res: Response) => {
    try {
      const today = new Date();

      const currentWeek = await prisma.week.findFirst({
        where: {
          startDate: {
            gte: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      });

      const subscriptions = await prisma.subscription.findMany({
        where: {
          weekNumber: currentWeek?.weekNumber,
          termNumber: currentWeek?.termNumber,
        },
        include: {
          FinanceItem: true,
        },
      });

      const totalSub = subscriptions.reduce((total, subscription) => {
        return total + (subscription.FinanceItem?.value || 0);
      }, 0);

      res.status(200).json({
        message: "current week subscription retrived succfully.",
        totalMoney: totalSub,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default statMoneyController;
