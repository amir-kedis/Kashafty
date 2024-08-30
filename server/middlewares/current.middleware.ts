import { Request, Response, NextFunction } from "express";
import { prisma } from "../database/db";
import asyncDec from "../utils/asyncDec";

declare global {
  namespace Express {
    interface Request {
      currentTerm?: {
        termNumber: number;
        [key: string]: any;
      };
      currentWeek?: {
        termNumber: number;
        weekNumber: number;
      };
    }
  }
}

async function _getCurrentTermMiddleware_(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const currentTerm = await prisma.term.findFirst({
    orderBy: {
      termNumber: "desc",
    },
  });

  if (!currentTerm) {
    req.currentTerm = {
      termNumber: 0,
    };
  } else req.currentTerm = currentTerm;

  next();
}

async function _getCurrentWeekMiddleware_(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const currentTerm = await prisma.term.findFirst({
    orderBy: {
      termNumber: "desc",
    },
  });

  const currentWeek = await prisma.week.findFirst({
    where: {
      termNumber: currentTerm?.termNumber,
    },
    orderBy: {
      weekNumber: "desc",
    },
  });

  if (!currentWeek) {
    req.currentWeek = {
      termNumber: 0,
      weekNumber: 0,
    };
  } else req.currentWeek = currentWeek;

  next();
}

export const getCurrentTermMiddleware = asyncDec(_getCurrentTermMiddleware_);
export const getCurrentWeekMiddleware = asyncDec(_getCurrentWeekMiddleware_);
