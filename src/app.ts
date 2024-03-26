import express from "express";
import authRouter from "./routes/auth";
import bodyParser from "body-parser";
import { TspecDocsMiddleware } from "tspec";

const PORT = 3000;

const initServer = async () => {
  const app = express();
  app.use(bodyParser.json());

  //add routers
  app.use("/auth", authRouter);

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
