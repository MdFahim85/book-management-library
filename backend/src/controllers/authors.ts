import { RequestHandler } from "express";
import { status } from "http-status";

import AuthorModel, {
  addAuthorSchema,
  Author,
  updateAuthorSchema,
} from "../models/Author";
import ROUTEMAP from "../routes/ROUTEMAP";
import { idValidator } from "../utils/validators";
import ResponseError from "../utils/ResponseError";

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
  const { id } = await idValidator.parseAsync(req.params);
  const author = await AuthorModel.getAuthorById(id);
  if (!author) throw new ResponseError("No author found", status.NOT_FOUND);
  res.json(author);
};

export const addAuthor: RequestHandler<
  {},
  { message: string; data: Author },
  Partial<Author>
> = async (req, res) => {
  const author = await AuthorModel.addAuthor(
    await addAuthorSchema.parseAsync(req.body)
  );
  if (!author) throw new ResponseError("Author not added", status.BAD_REQUEST);
  res.status(201).json({ message: "New author Added", data: author });
};

export const editAuthor: RequestHandler<
  Partial<typeof ROUTEMAP.authors._params>,
  { message: string; data: Author },
  Partial<Author>
> = async (req, res) => {
  const { id } = await idValidator.parseAsync(req.params);
  const author = await AuthorModel.editAuthor(
    id,
    await updateAuthorSchema.parseAsync(req.body)
  );
  if (!author)
    throw new ResponseError("Failed to update the book", status.BAD_REQUEST);
  res.json({ message: "Author has been updated", data: author });
};

export const deleteAuthor: RequestHandler<
  Partial<typeof ROUTEMAP.authors._params>
> = async (req, res) => {
  const { id } = await idValidator.parseAsync(req.params);
  res.json(await AuthorModel.deleteAuthor(id));
};
