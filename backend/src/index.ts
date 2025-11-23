import cors from "cors";
import express, { ErrorRequestHandler, RequestHandler } from "express";

import env from "./config/env";
import pgClient from "./config/pgClient";
import router from "./routes";

const app = express();

app.use(express.json());
app.use(cors());

app.use(router);

app.use((_, __, next) => next(new Error("Route Not Found")));
app.use(((err, _, res, __) => {
  if (!env.isProduction) console.log("Error: %o", err);

  if (res.headersSent) return console.log("Already Sent Response");

  res.status(500).json({ error: err });
}) as ErrorRequestHandler);

app.listen(env.port, async () => {
  await pgClient.connect();
  console.log("server running");
});
