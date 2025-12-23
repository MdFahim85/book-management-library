import { DrizzleError, DrizzleQueryError } from "drizzle-orm";
import type { ErrorRequestHandler, RequestHandler } from "express";
import status from "http-status";
import jwt from "jsonwebtoken";
import multer from "multer";
import z, { ZodError, ZodSchema } from "zod";

import config from "../../config";
import env from "../../config/env";
import ResponseError from "../../utils/ResponseError";
import UserModel from "../../models/User";

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

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, config.uploadDir);
  },
  filename: (_, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter: multer.Options["fileFilter"] = (_, file, cb) => {
  if (file.mimetype !== "application/pdf") {
    cb(
      new ResponseError(
        "Please upload a valid PDF",
        status.UNSUPPORTED_MEDIA_TYPE
      )
    );
  } else {
    cb(null, true);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const authMiddleware: RequestHandler = async (req, _res, next) => {
  const { token } = req.cookies;
  if (!token) throw new ResponseError("No token provided", status.UNAUTHORIZED);

  let verifiedToken: string | jwt.JwtPayload;

  try {
    verifiedToken = jwt.verify(token, env.jwtSecret);
  } catch (error) {
    throw new ResponseError("Broken Token", status.UNAUTHORIZED);
  }

  if (!verifiedToken)
    throw new ResponseError("Unauthorized access", status.UNAUTHORIZED);

  const { id } = await jwtSchema.parseAsync(verifiedToken).catch((reason) => {
    console.error(reason);

    throw new ResponseError("Invalid Token", status.UNPROCESSABLE_ENTITY);
  });

  const user = await UserModel.getUserById(id);

  if (!user) throw new ResponseError("Invalid User", status.NOT_FOUND);

  // Omitting password
  const { password, ...userWithoutPass } = user;
  req.user = userWithoutPass;

  next();
};

const jwtSchema = z.object({
  id: z.number().int().min(1),
  iat: z.number().int().optional(),
} satisfies { [key in keyof JwtToken]: ZodSchema });
