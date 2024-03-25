import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.status(200).send("this is a random message");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
