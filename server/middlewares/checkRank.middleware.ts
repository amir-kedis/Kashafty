import { Request, Response, NextFunction } from "express";

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
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> => {
    const captainRank = req.captain?.type;

    if (!captainRank) return res.status(403).json({ message: "Forbidden" });

    for (const rank of ranks) {
      if (rank === captainRank) {
        next();
        return;
      }
    }
    return res.status(403).json({ message: "Forbidden" });
  };
};

export default checkRankMiddleware;
