import { Request, Response, NextFunction } from "express";

function asyncDec(fn: Function) {
  return function (req: Request, res: Response, next: NextFunction) {
    fn(req, res, next).catch(next);
  };
}

export default asyncDec;