import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../database/db";
import AppError  from "../utils/AppError";
import asyncDec from "../utils/asyncDec";


// Define the Captain type
interface Captain {
  captainId: number;
  [key: string]: any; // Add other fields as needed
}

// Extend the Express Request interface to include the captain property
declare module "express-serve-static-core" {
  interface Request {
    captain?: Captain;
  }
}

// Define the DecodedToken type
interface DecodedToken {
  id: string;
  [key: string]: any; // Add other fields as needed
}


async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // Get token from cookie
  const token = req.cookies.token;

  if (!token) 
    throw new AppError(401, "No token provided or provided token has expired", "مفيش توكين او التوكين اللي انت داخل بيه انتهى");

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as DecodedToken;

  const id = decoded.id;

  const captain = await prisma.captain.findUnique({
    where: {
      captainId: parseInt(id),
    },
  });

  if (!captain) 
    throw new AppError(404, "Captain not found", "الكابتن مش موجود");

  // Attach captain to the request object
  req.captain = captain;

  next();
}

export default asyncDec(authMiddleware);
