import { Response } from "express";
import { prisma } from "../database/db";
import AppError from "../utils/AppError";
import asyncDec from "../utils/asyncDec";

// ==============================================
// TODO: needs integration testing
// ==============================================


// @desc    Get a term
// @route   GET /api/term/
// @access  Private

async function getTerm(req: any, res: Response){

  if(req.currentTerm.termNumber === 0){
    throw new AppError(400, "There is no terms in the system", "لا توجد فترات في النظام");
  }

  res.status(200).json({
    message: "Current term found successfully",
    body: req.currentTerm
  });

}


// @desc    Add a term
// @route   POST /api/term/
// @access  Private

async function addTerm(req: any, res: Response){

  const { termName, startDate, endDate } = req.body;

  const currentDate = new Date();
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);
 
  if (startDateObj >= endDateObj || endDateObj < currentDate) {
    throw new AppError(400, "Invalid dates", "تواريخ غير صالحة");
  }

  if (
    req.currentTerm.termNumber &&
    req.currentTerm.endDate &&
    req.currentTerm.endDate >= startDateObj
  ) {
    throw new AppError(400, "Invalid start date: Overlapping terms", "تاريخ بدء غير صالح: تداخل الفصول");
  }

  const termNumber = req.currentTerm.termNumber + 1;

  const newTerm = await prisma.term.create({
    data: {
      termNumber,
      termName,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    },
  });

  res.status(201).json({
    message: "Term added successfully",
    body: newTerm,
  });

}


// @desc    Update a term
// @route   PATCH /api/term/
// @access  Private

async function updateTerm(req: any, res: Response){

  const { termName, startDate, endDate } = req.body;

  const currentDate = new Date();
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  if (startDateObj >= endDateObj) {
    throw new AppError(400, "Invalid dates", "تواريخ غير صالحة");
  }

  let prevTerm = await prisma.term.findMany({
    orderBy: {
      termNumber: "desc",
    },
    take: 1,
    skip: 1,
  });

  if (!prevTerm.length) {
    req.previousTerm = {
      termNumber: 0,
    };
  } else req.previousTerm = prevTerm[0];

  if (
    req?.previousTerm?.termNumber &&
    req?.previousTerm?.endDate &&
    req?.previousTerm?.endDate >= startDateObj
  ) {
    throw new AppError(400, "Invalid start date: Overlapping terms", "تاريخ بدء غير صالح: تداخل الفصول");
  }

  const updatedTerm = await prisma.term.update({
    where: {
      termNumber: req.currentTerm.termNumber,
    },
    data: {
      termName,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    },
  });

  res.status(200).json({
    message: "Term updated successfully",
    body: updatedTerm,
  });
}

// @desc    Get a week
// @route   GET /api/term/week
// @access  Private

async function getCurrentWeek(req: any, res: Response){

  if(req.currentWeek.weekNumber === 0){
    throw new AppError(400, "There is no weeks or terms in the system", "لا توجد أسابيع أو فصول في النظام");
  }

  res.status(200).json({
    message: "Current week found successfully",
    body: req.currentWeek
  });

}


// @desc    Get all weeks in term
// @route   GET /api/term/week/all
// @access  Private

async function getAllWeeks(req: any, res: Response){

  const weeks = await prisma.week.findMany({
    where: {
      termNumber: req.currentTerm.termNumber,
    },
  });

  res.status(200).json({
    message: "all weeks in current term found successfully",
    body: weeks,
  });
}


// @desc    Cancel a week
// @route   PATCH /api/term/week
// @access  Private

async function cancelWeek(req: any, res: Response){

  if (req.currentWeek.weekNumber === 0) {
    throw new AppError(400, "There is no weeks or terms in the system to be cancelled", "لا توجد أسابيع أو فصول في النظام للإلغاء");
  }

  const termNumber = parseInt(req.currentWeek.termNumber);
  const weekNumber = parseInt(req.currentWeek.weekNumber);

  // TODO: needs testing
  const updatedWeek = await prisma.week.update({
    where: {
      weekNumber_termNumber: {
        termNumber,
        weekNumber,
      },
    },
    data: {
      cancelled: true,
    },
  });

  res.status(200).json({
    message: "Week cancelled successfully",
    body: updatedWeek,
  });
}




// @desc    Get remaining weeks
// @route   GET /api/term/remaining
// @access  Private

async function getRemainingWeeks(req: any, res: Response){

  const currentDate = new Date();

  if (
    req.currentTerm.termNumber === 0 ||
    (req.currentTerm.endDate && req.currentTerm.endDate < currentDate)
  ) {
    throw new AppError(400, "There is no running term in the system", "لا توجد فصول جارية في النظام");
  }

  const remainingWeeks = Math.ceil(
    (req.currentTerm.endDate.getTime() - currentDate.getTime()) /
      (1000 * 60 * 60 * 24 * 7),
  );

  res.status(200).json({
    message: "Remaining weeks found successfully",
    body: remainingWeeks,
  });
}



const termController = {
  getTerm: asyncDec(getTerm),
  addTerm: asyncDec(addTerm),
  updateTerm: asyncDec(updateTerm),
  getCurrentWeek: asyncDec(getCurrentWeek),
  getAllWeeks: asyncDec(getAllWeeks),
  cancelWeek: asyncDec(cancelWeek),
  getRemainingWeeks: asyncDec(getRemainingWeeks)
};

export default termController;
