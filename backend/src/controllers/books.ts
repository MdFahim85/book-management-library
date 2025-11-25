import { RequestHandler } from "express";

import {
  Book,
  bookAuthorIdParamSchema,
  bookIdParamSchema,
  insertBookSchema,
  updateBookSchema,
} from "../db/schemas/book";
import BookModel from "../models/Book";
import ROUTEMAP from "../routes/ROUTEMAP";

export const getBooks: RequestHandler<{}, Book[]> = async (_, res) =>
  res.json(await BookModel.getAllBooks());

export const getBookDetails: RequestHandler<
  typeof ROUTEMAP.books._params
> = async (req, res) => {
  const book = await BookModel.getBookById(
    bookIdParamSchema.parse(req.params.id)
  );
  if (!book) throw new Error("No book found");
  res.json(book);
};

export const getBooksByAuthorId: RequestHandler<
  typeof ROUTEMAP.books._params,
  Book[]
> = async (req, res) => {
  res.json(
    await BookModel.getBooksByAuthorId(
      bookAuthorIdParamSchema.parse(req.params.authorId)
    )
  );
};

export const addBook: RequestHandler<
  {},
  { message: string; data: Book },
  Partial<Book>
> = async (req, res) => {
  const book = await BookModel.addBook(insertBookSchema.parse(req.body));
  if (!book) throw new Error("Failed to add book");

  res.status(201).json({ message: "New book Added", data: book });
};

export const editBook: RequestHandler<
  Partial<typeof ROUTEMAP.books._params>,
  { message: string; data: Book },
  Partial<Book>
> = async (req, res) => {
  const book = await BookModel.editBook(
    bookIdParamSchema.parse(req.params.id),
    updateBookSchema.parse(req.body)
  );
  if (!book) throw new Error("Failed to update the book");

  res.json({
    message: "Book has been updated",
    data: book,
  });
};

export const deleteBook: RequestHandler<
  Partial<typeof ROUTEMAP.books._params>
> = async (req, res) => {
  res.json(await BookModel.deleteBook(bookIdParamSchema.parse(req.params.id)));
};
