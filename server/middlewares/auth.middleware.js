import jwt from "jsonwebtoken";
import db from "../database/db.js";

const authMiddleware = async (req, res, next) => {
  // Get token from cookie
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ error: "No token provided or Provided token has expired" });
  }

  try {
    // Verify token and get captain's id
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.id;

    // Get captain's data
    const result = await db.query(
      `SELECT *
            FROM "Captain" 
            WHERE "captainId" = $1;`,
      [id],
    );
    if (!result.rows.length) {
      return res.status(404).json({ error: "Captain not found" });
    }

    // Attach captain to the request object
    req.captain = result.rows[0];

    next();
  } catch (err) {
    console.log(err);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Provided token has expired" });
    }
    res.status(401).json({ error: "Invalid token" });
  }
};

export default authMiddleware;
