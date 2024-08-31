/*==================================================================================================
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
 *==================================================================================================*/

import { Request, Response } from "express";
import { prisma } from "../../database/db";
import AppError from "../../utils/AppError";
import asyncDec from "../../utils/asyncDec";

async function getTotalMoney(req: Request, res: Response) {
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

  return res.status(200).json({
    message: "retrived money successfully.",
    totalMoney: (income._sum.value ?? 0) - (expense._sum.value ?? 0),
  });
}

async function getTotalIncome(req: Request, res: Response) {
  const income = await prisma.financeItem.aggregate({
    _sum: {
      value: true,
    },
    where: {
      type: "income",
    },
  });

  return res.status(200).json({
    message: "retrived money successfully.",
    totalMoney: income._sum.value ?? 0,
  });
}

async function getTotalExpense(req: Request, res: Response) {
  const expense = await prisma.financeItem.aggregate({
    _sum: {
      value: true,
    },
    where: {
      type: "expense",
    },
  });

  return res.status(200).json({
    message: "retrived money successfully.",
    totalMoney: expense._sum.value ?? 0,
  });
}

async function getCurrentWeekSubscription(req: Request, res: Response) {
  const today = new Date();

  const currentWeek = await prisma.week.findFirst({
    where: {
      startDate: {
        gte: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
      },
    },
  });

  if (!currentWeek) {
    throw new AppError(404, "Current week not found", "الأسبوع الحالي غير موجود");
  }

  const subscriptions = await prisma.subscription.findMany({
    where: {
      weekNumber: currentWeek.weekNumber,
      termNumber: currentWeek.termNumber,
    },
    include: {
      FinanceItem: true,
    },
  });

  const totalSub = subscriptions.reduce((total, subscription) => {
    return total + (subscription.FinanceItem?.value || 0);
  }, 0);

  return res.status(200).json({
    message: "current week subscription retrieved successfully.",
    totalMoney: totalSub,
  });
}

async function getMoneyLineChart(req: Request, res: Response) {
  const currentTerm = await prisma.term.findFirst({
    orderBy: {
      termNumber: "desc",
    },
    include: {
      Week: true,
    },
  });

  if (!currentTerm) {
    throw new AppError(404, "Current term not found", "الفصل الدراسي الحالي غير موجود");
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

      return {
        weekNumber: week.weekNumber,
        totalMoney: (income._sum.value ?? 0) - (expense._sum.value ?? 0),
      };
    }),
  );

  return res.status(200).json({
    message: "Data retrieved successfully.",
    weeklyTotals: weeklyTotals,
  });
}

async function getIncomeExpenseStackedChart(req: Request, res: Response) {
  const currentTerm = await prisma.term.findFirst({
    orderBy: {
      termNumber: "desc",
    },
    include: {
      Week: true,
    },
  });

  if (!currentTerm) {
    throw new AppError(404, "Current term not found", "الفصل الدراسي الحالي غير موجود");
  }

  const weeklyData = await Promise.all(
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

      return {
        weekNumber: week.weekNumber,
        totalIncome: income._sum.value ?? 0,
        totalExpense: expense._sum.value ?? 0,
      };
    }),
  );

  return res.status(200).json({
    message: "Data retrieved successfully.",
    weeklyData: weeklyData,
  });
}

async function getSubscriptionLineChart(req: Request, res: Response) {
  const currentTerm = await prisma.term.findFirst({
    orderBy: {
      termNumber: "desc",
    },
    include: {
      Week: true,
    },
  });

  if (!currentTerm) {
    throw new AppError(404, "Current term not found", "الفصل الدراسي الحالي غير موجود");
  }

  const weeklyData = await Promise.all(
    currentTerm.Week.map(async (week) => {
      const subscriptions = await prisma.subscription.findMany({
        where: {
          weekNumber: week.weekNumber,
          termNumber: week.termNumber,
        },
        include: {
          FinanceItem: true,
        },
      });

      const totalSubscription = subscriptions.reduce(
        (total, subscription) => {
          return total + (subscription.FinanceItem?.value || 0);
        },
        0,
      );

      return {
        weekNumber: week.weekNumber,
        totalSubscription: totalSubscription,
      };
    }),
  );

  return res.status(200).json({
    message: "Data retrieved successfully.",
    weeklyData: weeklyData,
  });
}

const statMoneyController = {
  getTotalMoney: asyncDec(getTotalMoney),
  getTotalIncome: asyncDec(getTotalIncome),
  getTotalExpense: asyncDec(getTotalExpense),
  getCurrentWeekSubscription: asyncDec(getCurrentWeekSubscription),
  getMoneyLineChart: asyncDec(getMoneyLineChart),
  getIncomeExpenseStackedChart: asyncDec(getIncomeExpenseStackedChart),
  getSubscriptionLineChart: asyncDec(getSubscriptionLineChart),
};

export default statMoneyController;
