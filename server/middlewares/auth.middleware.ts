import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import db from "../database/db";

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

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  // Get token from cookie
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ error: "No token provided or provided token has expired" });
  }

  try {
    // Verify token and get captain's id
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as DecodedToken;
    const id = decoded.id;

    // Get captain's data
    const result = await db.query(
      `SELECT * FROM "Captain" WHERE "captainId" = $1;`,
      [id],
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Captain not found" });
    }

    // Attach captain to the request object
    req.captain = result.rows[0];

    next();
  } catch (err: any) {
    console.log(err);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Provided token has expired" });
    }
    res.status(401).json({ error: "Invalid token" });
  }
};

export default authMiddleware;
