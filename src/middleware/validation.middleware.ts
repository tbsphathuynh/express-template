import { NextFunction, Request, Response } from "express";
import { formatResponse } from "../config/responseFormatter";

export const validateBody = (zodValidator: (payload: any) => any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      zodValidator(req.body);
      next();
    } catch (error: any) {
      res
        .status(400)
        .json(formatResponse(false, "Invalid body", (error = error.errors)));
    }
  };
};
export const validateParams = (zodValidator: (payload: any) => any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      zodValidator(req.params);
      next();
    } catch (error: any) {
      res
        .status(400)
        .json(formatResponse(false, "Invalid params", (error = error.errors)));
    }
  };
};
export const validateQuery = (zodValidator: (payload: any) => any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      zodValidator(req.query);
      next();
    } catch (error: any) {
      res
        .status(400)
        .json(formatResponse(false, "Invalid query", (error = error.errors)));
    }
  };
};
