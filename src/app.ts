import express from "express";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import bodyParser from "body-parser";
import { TspecDocsMiddleware } from "tspec";
import { errorHandler } from "./middleware/error.middleware";
import dotenv from "dotenv";

const PORT = 3000;
dotenv.config();

const initServer = async () => {
  if (!process.env.SECRET_KEY) {
    throw new Error("jwt secret key not set");
  }

  const app = express();

  app.use(bodyParser.json());
  //add routers
  app.use("/auth", authRouter);
  app.use("/user", userRouter);

  app.use(errorHandler);

  //documentation
  app.use(
    "/docs",
    await TspecDocsMiddleware({
      openapi: {
        title: "Gates test backend",
        securityDefinitions: {
          jwt: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    })
  );

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

initServer();
