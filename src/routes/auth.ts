import { Router, Request, Response, NextFunction } from "express";
import { Tspec } from "tspec";
import { User } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";

import { ApiError } from "../types/errors";
import { WrapBody } from "../types/utils";
import { JwtToken, SignInData, SignUpData, UserData } from "../types/api";
import { getUserDataFields } from "../utils/api";
import "express-async-errors";
import { validateData } from "../utils/schema";
import { signUpSchema, signInSchema } from "../schemas/auth";

//checked on load - can cast directly
const SECRET_KEY = process.env.SECRET_KEY as string;

const router = Router();
const prisma = new PrismaClient();
const emailSchema = z.string().email();

const signUp = async (req: WrapBody<SignUpData>, res: Response<UserData>) => {
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
        });
        if (newUser) {
          res.json(getUserDataFields(newUser));
        } else {
          throw new ApiError("Error creating user", 500);
        }
      }
    });
  }
};

const signIn = async (req: WrapBody<SignInData>, res: Response<JwtToken>) => {
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });

  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const token = jwt.sign({ email: req.body.email }, SECRET_KEY, {
        expiresIn: "2h",
      });
      res.json({ token });
    } else {
      throw new ApiError("password incorrect", 400);
    }
  } else {
    throw new ApiError("email is not registered", 404);
  }
};

export type AuthApiSpec = Tspec.DefineApiSpec<{
  paths: {
    "/auth/signup": {
      post: {
        summary: "sign  up new user";
        handler: typeof signUp;
      };
    };
    "/auth/signin": {
      post: {
        summary: "sign in to user account";
        handler: typeof signIn;
      };
    };
  };
}>;

router.post("/signup", validateData(signUpSchema), signUp);
router.post("/signin", validateData(signInSchema), signIn);

export default router;
