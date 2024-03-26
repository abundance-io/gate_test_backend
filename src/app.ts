import express from "express";
import authRouter from "./routes/auth";
import bodyParser from "body-parser";
import { TspecDocsMiddleware } from "tspec";
import { ErrorRequestHandler } from "express";
import { ApiError } from "./types/errors";
import { errorHandler } from "./middleware/error.middleware";

const PORT = 3000;

const initServer = async () => {
  const app = express();
  app.use(bodyParser.json());
  //add routers
  app.use("/auth", authRouter);

  app.use(errorHandler);

  //documentation
  app.use(
    "/docs",
    await TspecDocsMiddleware({
      openapi: {
        title: "Gates test backend",
      },
    })
  );

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

initServer();
