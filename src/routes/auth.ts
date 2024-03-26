import { Router, Request, Response, NextFunction } from "express";
import { Tspec } from "tspec";
import { User } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import "express-async-errors";

import { ApiError } from "../types/errors";
import { WrapBody } from "../types/utils";
import { SignInData, SignUpData, UserData } from "../types/api";

const router = Router();
const prisma = new PrismaClient();

const signUp = async (
  req: WrapBody<SignUpData>,
  res: Response<UserData>,
  next: NextFunction
) => {
  if (
    await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    })
  ) {
    throw new ApiError("Email already used", 400);
  } else {
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      if (err) {
        throw new ApiError("Internal server error", 500);
      } else {
        const newUser = await prisma.user.create({
          data: {
            email: req.body.email,
            password: hash,
            firstname: req.body.firstname,
            lastname: req.body.firstname,
          },
          select: {
            email: true,
            firstname: true,
            lastname: true,
            profile_picture: true,
          },
        });
        if (newUser) {
          res.json(newUser);
        } else {
          throw new ApiError("Error creating user", 500);
        }
      }
    });
  }
};

const signIn = async (req: Request<SignInData>, res: Response<UserData>) => {};

export type AuthApiSpec = Tspec.DefineApiSpec<{
  paths: {
    "/auth/signup": {
      post: {
        summary: "sign  up new user";
        handler: typeof signUp;
      };
    };
  };
}>;

router.post("/signup", signUp);

export default router;
