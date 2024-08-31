import { Request, Response } from "express";
import { prisma } from "../database/db";
import { Notification } from "@prisma/client";
import asyncDec from "../utils/asyncDec";

interface GetSubscriptionRequest extends Request {
  query: {
    sectorBaseName: string;
    sectorSuffixName: string;
    weekNumber: string;
    termNumber: string;
  };
}


// @desc    Get a budget
// @route   GET /api/finance/budget
// @access  Private

async function getBudget(_: Request, res: Response) {

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

// @desc    Get income
// @route   GET /api/finance/income
// @access  Private

async function getIncome(_: Request, res: Response) {

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

}


// @desc    Get expense
// @route   GET /api/finance/expense
// @access  Private


async function getExpense(_: Request, res: Response) {

  const result = await prisma.financeItem.findMany({
    where: {
      type: "expense",
    },
    include: {
      OtherItem: true,
    },
  });

  const expense = result;

  res.status(200).json({
    message: "Get expense successfully",
    body: expense,
  });

}



// @desc    Add a subscription
// @route   POST /api/finance/subscription
// @access  Private

async function addSubscription(req: Request, res: Response) {

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

  // Notify general captains
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

  const sentMsgs = await prisma.notification.createMany({
    data: notifications as Notification[],
  });

  console.log(sentMsgs);

  res.status(200).json({
    message: "Add subscription successfully",
    body: { financeItem: financeItem, subscription: subscription },
  });
}

// @desc    Get all subscriptions of current week
// @route   GET /api/finance/subscription/all
// @access  Private

async function getAllSubscriptionsOfCurrentWeek(req: any, res: Response){

  const subscription = await prisma.subscription.findMany({
    where: {
      termNumber: req.currentWeek.termNumber,
      weekNumber: req.currentWeek.weekNumber,
    },
    include: {
      FinanceItem: true,
    },
  });

  const subscriptionValue = subscription.reduce(
    (acc, curr) => acc + curr.FinanceItem.value,
    0,
  );

  res.status(200).json({
    message: "Get subscription successfully",
    body: subscriptionValue,
  });
}


// @desc    Get a subscription
// @route   GET /api/finance/subscription
// @access  Private

async function getSubscription(req: GetSubscriptionRequest, res: Response) {

  let { sectorBaseName, sectorSuffixName, weekNumber, termNumber }: any =
  req.query;

  if (weekNumber === undefined)
    weekNumber = req?.currentWeek?.weekNumber.toString();

  if (termNumber === undefined)
    termNumber = req?.currentWeek?.termNumber.toString();

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
    body: subscription?.FinanceItem.value,
  });

}


// @desc    Add an other item
// @route   POST /api/finance/otherItem
// @access  Private

async function addOtherItem(req: Request, res: Response){

  const { value, type, description } = req.body;

  const financeItem = await prisma.financeItem.create({
    data: {
      value: parseInt(value),
      type: type,
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

}


const financeController = {

  getBudget : asyncDec(getBudget),
  getIncome : asyncDec(getIncome),
  getExpense : asyncDec(getExpense),
  addSubscription : asyncDec(addSubscription),
  getAllSubscriptionsOfCurrentWeek : asyncDec(getAllSubscriptionsOfCurrentWeek),
  getSubscription : asyncDec(getSubscription),
  addOtherItem : asyncDec(addOtherItem),
};

export default financeController;
