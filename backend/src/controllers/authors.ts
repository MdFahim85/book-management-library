import { RequestHandler } from "express";

import {
  addAuthorSchema,
  Author,
  authorIdParamSchema,
  updateAuthorSchema,
} from "../db/schemas/author";
import AuthorModel from "../models/Author";
import ROUTEMAP from "../routes/ROUTEMAP";

export const getAuthors: RequestHandler<{}, Author[]> = async (
  _,
  res,
  next
) => {
  try {
    res.json(await AuthorModel.getAllAuthors());
  } catch (error) {
    next(error);
  }
};

export const getAuthorById: RequestHandler<
  typeof ROUTEMAP.authors._params,
  Author
> = async (req, res) => {
  const author = await AuthorModel.getAuthorById(
    authorIdParamSchema.parse(req.params.id)
  );
  if (!author) throw new Error("No author found");
  res.json(author);
};

export const addAuthor: RequestHandler<
  {},
  { message: string; data: Author },
  Partial<Author>
> = async (req, res) => {
  const author = await AuthorModel.addAuthor(addAuthorSchema.parse(req.body));
  if (!author) throw new Error("Author not added");
  res.status(201).json({ message: "New author Added", data: author });
};

export const editAuthor: RequestHandler<
  Partial<typeof ROUTEMAP.authors._params>,
  { message: string; data: Author },
  Partial<Author>
> = async (req, res) => {
  const author = await AuthorModel.editAuthor(
    authorIdParamSchema.parse(req.params.id),
    updateAuthorSchema.parse(req.body)
  );
  if (!author) throw new Error("Failed to update the book");
  res.json({
    message: "Author has been updated",
    data: author,
  });
};

export const deleteAuthor: RequestHandler<
  Partial<typeof ROUTEMAP.authors._params>
> = async (req, res) => {
  res.json(
    await AuthorModel.deleteAuthor(authorIdParamSchema.parse(req.params.id))
  );
};
