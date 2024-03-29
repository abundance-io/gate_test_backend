import express from "express";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import bodyParser from "body-parser";
import { TspecDocsMiddleware } from "tspec";
import { errorHandler } from "./middleware/error.middleware";
import cors from "cors";
import dotenv from "dotenv";
import { checkEnvs } from "./utils/env";

const PORT = 3000;
dotenv.config();

const initServer = async () => {
  checkEnvs();
  const app = express();

  app.use(cors());
  app.use(bodyParser.json());
  //add routers
  app.use("/auth", authRouter);
  app.use("/user", userRouter);

  app.use(errorHandler);

  //documentation
  app.use(
    "/",
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
