import { RequestHandler } from "express";
import { promises as fs } from "fs";
import { status } from "http-status";

import AuthorModel, {
  addAuthorSchema,
  Author,
  updateAuthorSchema,
} from "../models/Author";
import BookModel from "../models/Book";
import ROUTEMAP from "../routes/ROUTEMAP";
import { fileExists } from "../utils";
import ResponseError from "../utils/ResponseError";
import { idValidator } from "../utils/validators";

export const getAuthors: RequestHandler<{}, Author[]> = async (_, res) => {
  console.log(_.user);
  res.json(await AuthorModel.getAllAuthors());
};

export const getAuthorById: RequestHandler<
  Partial<typeof ROUTEMAP.authors._params>,
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
    throw new ResponseError("Failed to update author", status.BAD_REQUEST);
  res.json({ message: "Author has been updated", data: author });
};

export const deleteAuthor: RequestHandler<
  Partial<typeof ROUTEMAP.authors._params>
> = async (req, res) => {
  const { id } = await idValidator.parseAsync(req.params);

  const books = await BookModel.getBooksByAuthorId(id);

  for (const book of books) {
    if (book.fileUrl && (await fileExists(book.fileUrl))) {
      await fs.unlink(book.fileUrl);
    }
  }

  const deletedAuthor = await AuthorModel.deleteAuthor(id);
  if (!deletedAuthor)
    throw new ResponseError("Failed to delete author", status.BAD_REQUEST);
  res.json(deletedAuthor);
};
