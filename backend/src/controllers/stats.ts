import { RequestHandler } from "express";
import status from "http-status";

import StatModel, { insertStatSchema, Stat } from "../models/Stat";
import ResponseError from "../utils/ResponseError";
import { idValidator, statIdValidator } from "../utils/validators";

export const getBookStats: RequestHandler<
  { bookId: number },
  { message: string }
> = async (req, res) => {
  const { id } = await idValidator.parseAsync(req.params);

  const bookStats = await StatModel.getBookStats(id);

  if (!bookStats.length)
    throw new ResponseError("table.noResults", status.NOT_FOUND);

  const totalReadTimeSeconds = bookStats.reduce(
    (acc, stat) => acc + stat.readTimeSeconds,
    0
  );

  res.json({
    message: `Total read time of book is ${totalReadTimeSeconds} seconds`,
  });
};

export const getBookByUserStats: RequestHandler<
  { bookId: number; userId: number },
  { message: string; data: Stat }
> = async (req, res) => {
  const { bookId, userId } = await statIdValidator.parseAsync(req.params);

  const stat = await StatModel.getBookByUserStats(bookId, userId);

  if (!stat) throw new ResponseError("table.noResults", status.NOT_FOUND);

  res.json({
    message: `User ${userId} has read ${stat.pagesRead} pages and ${stat.readTimeSeconds} seconds`,
    data: stat,
  });
};

export const addBookByUserStats: RequestHandler<
  {},
  { message: string },
  Stat
> = async (req, res) => {
  const bookStatByUser = await insertStatSchema.parseAsync(req.body);

  const updatedStat = await StatModel.addBookByUserStats(bookStatByUser);

  if (!updatedStat)
    throw new ResponseError("Failed the request", status.BAD_REQUEST);

  res.json({
    message: `Stats updated: User ${updatedStat.userId} has read ${updatedStat.pagesRead} pages and ${updatedStat.readTimeSeconds} seconds`,
  });
};
