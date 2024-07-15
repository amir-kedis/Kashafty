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

  /* getCurrentWeekSubscription
   *
   * @desc  get the total money at each week to form a line chart
   * @endpoint GET /api/stat/money/line-chart
   */
  getMoneyLineChart: async (_req: Request, res: Response) => {
    try {
      const currentTerm = await prisma.term.findFirst({
        orderBy: {
          termNumber: "desc",
        },
        include: {
          Week: true,
        },
      });

      if (!currentTerm) {
        return res
          .status(404)
          .json({ message: "لم يتم العثور على الفصل الحالي" });
      }

      const weeklyTotals = await Promise.all(
        currentTerm.Week.map(async (week) => {
          const income = await prisma.financeItem.aggregate({
            _sum: {
              value: true,
            },
            where: {
              type: "income",
              timestamp: {
                lt: new Date(
                  week.startDate.getTime() + 7 * 24 * 60 * 60 * 1000,
                ),
              },
            },
          });

          const expense = await prisma.financeItem.aggregate({
            _sum: {
              value: true,
            },
            where: {
              type: "expense",
              timestamp: {
                lt: new Date(
                  week.startDate.getTime() + 7 * 24 * 60 * 60 * 1000,
                ),
              },
            },
          });

          console.log((income._sum.value ?? 0) - (expense._sum.value ?? 0));

          return {
            weekNumber: week.weekNumber,
            totalMoney: (income._sum.value ?? 0) - (expense._sum.value ?? 0),
          };
        }),
      );

      res.status(200).json({
        message: "تم الحصول على البيانات بنجاح",
        weeklyTotals: weeklyTotals,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default statMoneyController;
