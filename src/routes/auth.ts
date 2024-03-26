import { Router, Request, Response } from "express";
import { WrapBody } from "./types";
import { Tspec } from "tspec";
import { User } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { Error } from "./types";
import bcrypt from "bcrypt";

const router = Router();
const prisma = new PrismaClient();

const signUp = async (
  req: WrapBody<User>,
  res: Response<Omit<User, "password"> | Error>
) => {
  if (
    await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    })
  ) {
    res.json({ err: "Email already used" }).status(400);
  } else {
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      if (err) {
        res.json({ err: "Internal server error" });
      } else {
        await prisma.user.create({
          data: {
            email: req.body.email,
            password: hash,
            firstname: req.body.firstname,
            lastname: req.body.firstname,
          },
        });
      }
    });
  }
};

export type ApiSpec = Tspec.DefineApiSpec<{
  paths: {
    "/auth/signup": {
      post: {
        summary: "sign  up new user";
        handler: typeof signUp;
      };
    };
  };
}>;

// router.get("/abundance", getAuthor);

export default router;
