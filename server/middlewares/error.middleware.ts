import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";

function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  res.status(404).json({
    message: `Not Found - ${req.originalUrl}`,
    status: "fail"
  });
}


function errorLogger(
  err: Error | AppError,
  req: Request,
  res: Response, 
  next: NextFunction
) {

  console.error(err);
  next(err);
}

function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
){

  let statusCode = 500;
  let status = "error";
  let message = "Internal Server Error";
  let arabicMessage = "دي مشكلتنا مش مشكلتك";

  if(err.name === "TokenExpiredError"){
    statusCode = 401;
    status = "fail";
    message = "Provided token has expired";
    arabicMessage = "التوكين اللي انت داخل بيه انتهى";
  }
  else if (err instanceof AppError) {
    statusCode = err.statusCode || statusCode;
    status = err.status || status;
    message = err.message || message;
    arabicMessage = err.arabicMessage || arabicMessage;
  }


  res.status(statusCode).json({
    status,
    message,
    arabicMessage
  });

}



export { notFoundHandler ,errorLogger, errorHandler };
