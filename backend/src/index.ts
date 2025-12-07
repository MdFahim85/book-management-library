import cors from "cors";
import morgan from "morgan";
import express, { ErrorRequestHandler, RequestHandler } from "express";

import env from "./config/env";
import router from "./routes";
import { ZodError } from "zod";
import ResponseError from "./utils/ResponseError";
import status from "http-status";
import { DrizzleError, DrizzleQueryError } from "drizzle-orm";
import { globalErrorHandler } from "./controllers/_middlewares";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.use(router);

app.use(() => {
  throw new ResponseError("Route Not Found", status.NOT_FOUND);
});
app.use(globalErrorHandler);

app.listen(env.port, () => {
  console.log("server running");
});
