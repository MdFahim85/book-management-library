import { DrizzleError, DrizzleQueryError } from "drizzle-orm";
import type { ErrorRequestHandler } from "express";
import status from "http-status";
import multer from "multer";
import { ZodError } from "zod";

import env from "../../config/env";
import ResponseError from "../../utils/ResponseError";

export const globalErrorHandler = ((err, _, res, __) => {
  if (!env.isProduction)
    console.dir(err, { colors: true, depth: 6, showHidden: true });
  const error = new ResponseError();

  if (err instanceof ZodError) {
    error.statusCode = status.UNPROCESSABLE_ENTITY;
    error.message = err.issues
      .map(({ path, message }) => "'" + path.join(".") + "' " + message)
      .join(",");
  } else if (err instanceof ResponseError) {
    error.message = err.message;
    error.statusCode = err.statusCode;
  } else if (
    err instanceof DrizzleError ||
    err.code === "23505" || // Duplicate key entry.
    err.code === "23503" // Foreign key constraint violated.
  )
    error.message = "Contact the developer";
  else if (err instanceof DrizzleQueryError) {
    if ((err.cause as any)?.code === "23505") {
      // Duplicate key entry.
      error.message = "Duplicate " + (err.cause as any)?.table;
      error.statusCode = status.CONFLICT;
    } else if ((err.cause as any)?.code === "23503") {
      // Foreign key constraint violated.
      error.message =
        "Unknown " +
        (err.cause as any)?.constraint
          .replace("_fkey", "")
          .replaceAll("_", " ");
      error.statusCode = status.UNPROCESSABLE_ENTITY;
    }
  } else if (err instanceof multer.MulterError) {
    error.message = "Failed to upload the file";
    error.statusCode = status.BAD_REQUEST;
  }
  if (res.headersSent) return console.log("Already Sent Response");

  res
    .status(error.statusCode)
    .json({ message: error.message || status["500"] });
}) as ErrorRequestHandler;

import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "src", "uploads"));
  },
  filename: (_req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage });
