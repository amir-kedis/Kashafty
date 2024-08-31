import { Request, Response } from "express";
import { prisma } from "../database/db";
import AppError from "../utils/AppError";
import asyncDec from "../utils/asyncDec";

async function getBudget(_req: Request, res: Response) {
  const incomeAgg = await prisma.financeItem.aggregate({
    _sum: {
      value: true,
    },
    where: {
      type: "income",
    },
  });
  const income = incomeAgg._sum.value || 0;

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

  return res.status(200).json({
    message: "Get budget successfully",
    body: budget,
  });
}

async function getIncome(_req: Request, res: Response) {
  const income = await prisma.financeItem.findMany({
    where: {
      type: "income",
    },
    include: {
      OtherItem: true,
    },
  });

  return res.status(200).json({
    message: "Get income successfully",
    body: income,
  });
}

async function getExpense(_req: Request, res: Response) {
  const expenses = await prisma.financeItem.findMany({
    where: {
      type: "expense",
    },
    include: {
      OtherItem: true,
    },
  });

  return res.status(200).json({
    message: "Get expense successfully",
    body: expenses,
  });
}

async function addSubscription(req: Request, res: Response) {
  const { value, sectorBaseName, sectorSuffixName, termNumber, weekNumber } =
    req.body;

  let subscr = await prisma.subscription.findFirst({
    where: {
      sectorBaseName,
      sectorSuffixName,
      weekNumber: parseInt(weekNumber),
      termNumber: parseInt(termNumber),
    },
  });

  let financeItem;
  if (!subscr) {
    financeItem = await prisma.financeItem.create({
      data: {
        value,
        type: "income",
        timestamp: new Date(),
      },
    });
  } else {
    financeItem = await prisma.financeItem.update({
      where: {
        itemId: subscr.itemId,
      },
      data: {
        value,
        timestamp: new Date(),
      },
    });
  }

  const subscription = await prisma.subscription.upsert({
    where: {
      itemId: financeItem.itemId,
    },
    update: {
      sectorBaseName,
      sectorSuffixName,
      weekNumber: parseInt(weekNumber),
      termNumber: parseInt(termNumber),
    },
    create: {
      itemId: financeItem.itemId,
      sectorBaseName,
      sectorSuffixName,
      weekNumber: parseInt(weekNumber),
      termNumber: parseInt(termNumber),
    },
  });

  const generalCaptains = await prisma.captain.findMany({
    where: {
      type: "general",
    },
  });

  const notifications = generalCaptains.map((captain) => ({
    captainId: captain.captainId,
    type: "financeItemCreated",
    status: "UNREAD",
    title: "تحديث اشتراك",
    message: `تم ${subscr ? "تحديث" : "إنشاء"} اشتراك لقطاع ${sectorBaseName} ${sectorSuffixName} بقيمة ${value}.`,
  }));

  await prisma.notification.createMany({
    data: notifications,
  });

  return res.status(200).json({
    message: "Add subscription successfully",
    body: { financeItem, subscription },
  });
}

async function getSubscription(req: Request, res: Response) {
  let { sectorBaseName, sectorSuffixName, weekNumber, termNumber } = req.query;

  if (!weekNumber) weekNumber = req?.currentWeek?.weekNumber.toString();
  if (!termNumber) termNumber = req?.currentWeek?.termNumber.toString();

  const subscription = await prisma.subscription.findFirst({
    where: {
      sectorBaseName,
      sectorSuffixName,
      weekNumber: parseInt(weekNumber),
      termNumber: parseInt(termNumber),
    },
    include: {
      FinanceItem: true,
    },
  });

  if (!subscription) {
    throw new AppError(404, "Subscription not found", "الاشتراك غير موجود");
  }

  return res.status(200).json({
    message: "Get subscription successfully",
    body: subscription.FinanceItem.value,
  });
}

async function getAllSubscriptionsOfCurrentWeek(req: Request, res: Response) {
  const subscriptions = await prisma.subscription.findMany({
    where: {
      termNumber: req.currentWeek.termNumber,
      weekNumber: req.currentWeek.weekNumber,
    },
    include: {
      FinanceItem: true,
    },
  });

  const subscriptionValue = subscriptions.reduce(
    (acc, curr) => acc + curr.FinanceItem.value,
    0
  );

  return res.status(200).json({
    message: "Get all subscriptions successfully",
    body: subscriptionValue,
  });
}

async function addOtherItem(req: Request, res: Response) {
  const { value, type, description } = req.body;

  const financeItem = await prisma.financeItem.create({
    data: {
      value: parseInt(value),
      type,
      timestamp: new Date(),
    },
  });

  const otherItem = await prisma.otherItem.create({
    data: {
      description,
      itemId: financeItem.itemId,
    },
  });

  return res.status(200).json({
    message: "Add other item successfully",
    body: { financeItem, otherItem },
  });
}

const financeController = {
  getBudget: asyncDec(getBudget),
  getIncome: asyncDec(getIncome),
  getExpense: asyncDec(getExpense),
  addSubscription: asyncDec(addSubscription),
  getSubscription: asyncDec(getSubscription),
  getAllSubscriptionsOfCurrentWeek: asyncDec(getAllSubscriptionsOfCurrentWeek),
  addOtherItem: asyncDec(addOtherItem),
};

export default financeController;
