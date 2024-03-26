import { ErrorRequestHandler } from "express";
import { ApiError } from "../types/errors";

export const errorHandler: ErrorRequestHandler = (
  err: ApiError,
  req,
  res,
  next
) => {
  res.status(err.statusCode).json({ message: err.message });
};
