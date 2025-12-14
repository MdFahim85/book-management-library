import cors from "cors";
import morgan from "morgan";
import express from "express";
import status from "http-status";
import cookieParser from "cookie-parser";

import env from "./config/env";
import router from "./routes";
import ResponseError from "./utils/ResponseError";
import { globalErrorHandler } from "./controllers/_middlewares";

const app = express();

app.use(morgan("dev"));
app.use(cors({ origin: env.frontend_API, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.use(() => {
  throw new ResponseError("Route Not Found", status.NOT_FOUND);
});
app.use(globalErrorHandler);

app.listen(env.port, () => {
  console.log("server running");
});
