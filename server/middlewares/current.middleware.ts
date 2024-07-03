import { Request, Response, NextFunction } from "express";
import db from "../database/db";

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
    const result = await db.query(
      `SELECT * FROM "Term" WHERE "termNumber" IN 
            (SELECT COALESCE(MAX("termNumber"), 0) FROM "Term");`,
    );

    if (!result.rows.length) {
      req.currentTerm = {
        termNumber: 0,
      };
    } else req.currentTerm = result.rows[0];

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
    const result = await db.query(
      `SELECT * FROM "Week" WHERE "weekNumber" IN
            (SELECT COALESCE(MAX("weekNumber"), 0) FROM "Week" WHERE "termNumber" IN
            (SELECT COALESCE(MAX("termNumber"), 0) FROM "Term"));`,
    );

    if (!result.rows.length) {
      req.currentWeek = {
        termNumber: 0,
        weekNumber: 0,
      };
    } else req.currentWeek = result.rows[0];

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "An error occurred while getting the Week",
    });
  }
};

export { getCurrentTermMiddleware, getCurrentWeekMiddleware };
