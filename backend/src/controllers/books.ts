import { RequestHandler } from "express";
import status from "http-status";
import { promises as fs } from "fs";

import BookModel, {
  type Book,
  insertBookSchema,
  updateBookSchema,
} from "../models/Book";
import ROUTEMAP from "../routes/ROUTEMAP";
import ResponseError from "../utils/ResponseError";
import { authorIdValidator, idValidator } from "../utils/validators";
import path from "path";
import { log } from "console";

export const getBooks: RequestHandler<{}, Book[]> = async (_, res) =>
  res.json(await BookModel.getAllBooks());

export const getBookDetails: RequestHandler<
  Partial<typeof ROUTEMAP.books._params>
> = async (req, res) => {
  const { id } = await idValidator.parseAsync(req.params);
  const book = await BookModel.getBookById(id);
  if (!book) throw new ResponseError("No book found", status.NOT_FOUND);
  res.json(book);
};

export const getBooksByAuthorId: RequestHandler<
  Partial<typeof ROUTEMAP.books._params>,
  Book[]
> = async (req, res) => {
  const { authorId } = await authorIdValidator.parseAsync(req.params);
  res.json(await BookModel.getBooksByAuthorId(authorId));
};

export const addBook: RequestHandler<
  {},
  { message: string; data: Book },
  Partial<Book> & { json?: string }
> = async (req, res) => {
  const bookPdf = req.file;
  const json: Book = JSON.parse(req.body.json || "");
  if (!bookPdf)
    throw new ResponseError("Please attach a pdf", status.BAD_REQUEST);
  json.fileUrl = bookPdf.filename;
  const book = await BookModel.addBook(await insertBookSchema.parseAsync(json));
  if (!book) throw new ResponseError("Failed to add book", status.BAD_REQUEST);

  res.status(201).json({ message: "New book Added", data: book });
};

export const editBook: RequestHandler<
  Partial<typeof ROUTEMAP.books._params>,
  { message: string; data: Book },
  Partial<Book> & { json?: string }
> = async (req, res) => {
  const { id } = await idValidator.parseAsync(req.params);
  const bookPdf = req.file;
  const json: Book = JSON.parse(req.body.json || "");
  if (!bookPdf)
    throw new ResponseError("Please attach a pdf", status.BAD_REQUEST);
  json.fileUrl = bookPdf.filename;
  const oldBook = await BookModel.getBookById(id);
  if (oldBook) {
    await fs.unlink(path.join("public/uploads", oldBook.fileUrl));
  }
  const book = await BookModel.editBook(
    id,
    await updateBookSchema.parseAsync(json)
  );
  if (!book)
    throw new ResponseError("Failed to update the book", status.BAD_REQUEST);

  res.json({ message: "Book has been updated", data: book });
};

export const deleteBook: RequestHandler<
  Partial<typeof ROUTEMAP.books._params>
> = async (req, res) => {
  const { id } = await idValidator.parseAsync(req.params);
  const deletedBook = await BookModel.getBookById(id);
  if (deletedBook) {
    try {
      await fs.unlink(path.join("public/uploads", deletedBook.fileUrl));
    } catch (error) {
      throw new ResponseError("Failed to delete the pdf", status.BAD_REQUEST);
    }
  }
  res.json(await BookModel.deleteBook(id));
};
