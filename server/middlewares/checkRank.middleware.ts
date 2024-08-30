import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import asyncDec from "../utils/asyncDec";

declare global {
  namespace Express {
    interface Request {
      captain?: {
        type: string;
        [key: string]: any;
      };
    }
  }
}

const checkRankMiddleware = (...ranks: string[]) => {
  return asyncDec(checkRankMiddleware);

  function checkRankMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const captainRank = req.captain?.type;

    if (!captainRank) throw new AppError(403, "Forbidden", "ممنوع");

    for (const rank of ranks) {
      if (rank === captainRank) {
        next();
        return;
      }
    }

    throw new AppError(403, "Forbidden", "ممنوع");
  }
};

export default checkRankMiddleware;
