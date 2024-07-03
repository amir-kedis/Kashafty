import { Request, Response, NextFunction } from "express";
import { prisma } from "../database/db";

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

const getCurrentTermMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "An error occurred while getting the term",
    });
  }
};

const getCurrentWeekMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "An error occurred while getting the Week",
    });
  }
};

export { getCurrentTermMiddleware, getCurrentWeekMiddleware };
