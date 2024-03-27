import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../types/errors";
import { PrismaClient } from "@prisma/client";
import { getUserDataFields } from "../utils/api";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY as string;

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization");
  if (token && token?.startsWith("Bearer ")) {
    try {
      const decoded = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY) as {
        email: string;
      };
      res.locals.email = decoded.email;
      next();
    } catch (err) {
      throw new ApiError("Access Denied", 401);
    }
  } else {
    throw new ApiError("Access Denied", 401);
  }
};
