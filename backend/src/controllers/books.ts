import { RequestHandler } from "express";

import BookModel, {
  Book,
  insertBookSchema,
  updateBookSchema,
} from "../models/Book";
import ROUTEMAP from "../routes/ROUTEMAP";
import { authorIdValidator, idValidator } from "../utils/validators";
import ResponseError from "../utils/ResponseError";
import status from "http-status";

export const getBooks: RequestHandler<{}, Book[]> = async (_, res) =>
  res.json(await BookModel.getAllBooks());

export const getBookDetails: RequestHandler<
  typeof ROUTEMAP.books._params
> = async (req, res) => {
  const { id } = await idValidator.parseAsync(req.params);
  const book = await BookModel.getBookById(id);
  if (!book) throw new ResponseError("No book found", status.NOT_FOUND);
  res.json(book);
};

export const getBooksByAuthorId: RequestHandler<
  typeof ROUTEMAP.books._params,
  Book[]
> = async (req, res) => {
  const { authorId } = await authorIdValidator.parseAsync(req.params);
  res.json(await BookModel.getBooksByAuthorId(authorId));
};

export const addBook: RequestHandler<
  {},
  { message: string; data: Book },
  Partial<Book>
> = async (req, res) => {
  const book = await BookModel.addBook(
    await insertBookSchema.parseAsync(req.body)
  );
  if (!book) throw new ResponseError("Failed to add book", status.BAD_REQUEST);

  res.status(201).json({ message: "New book Added", data: book });
};

export const editBook: RequestHandler<
  Partial<typeof ROUTEMAP.books._params>,
  { message: string; data: Book },
  Partial<Book>
> = async (req, res) => {
  const { id } = await idValidator.parseAsync(req.params);
  const book = await BookModel.editBook(
    id,
    await updateBookSchema.parseAsync(req.body)
  );
  if (!book)
    throw new ResponseError("Failed to update the book", status.BAD_REQUEST);

  res.json({ message: "Book has been updated", data: book });
};

export const deleteBook: RequestHandler<
  Partial<typeof ROUTEMAP.books._params>
> = async (req, res) => {
  const { id } = await idValidator.parseAsync(req.params);
  res.json(await BookModel.deleteBook(id));
};
