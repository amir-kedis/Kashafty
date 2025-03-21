import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import asyncDec from "../utils/asyncDec";

interface AuthRequest extends Request {
  captain: {
    type: string;
  };
}

async function isGeneralOrUnitCaptainHandler(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.captain) {
    throw new AppError(401, "Unauthorized", "غير مصرح");
  }

  if (req.captain.type !== "general" && req.captain.type !== "unit") {
    throw new AppError(
      403, 
      "You don't have permission to delete scouts", 
      "ليس لديك صلاحية لحذف الكشافة"
    );
  }

  next();
}

const isGeneralOrUnitCaptain = asyncDec(isGeneralOrUnitCaptainHandler);

export { isGeneralOrUnitCaptain };