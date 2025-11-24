import { RequestHandler } from "express";

import Book from "../models/Book";
import ROUTEMAP from "../routes/ROUTEMAP";

export const getBooks: RequestHandler<{}, Book[]> = async (_, res) =>
  res.json(await Book.getAllBooks());

export const getBookDetails: RequestHandler<Pick<Book, "id">> = async (
  req,
  res
) => {
  const { id } = req.params;
  const book = await Book.getBookById(id);
  if (!book) throw new Error("No book found");
  res.json(book);
};

export const getBooksByAuthorId: RequestHandler<
  Partial<typeof ROUTEMAP.books._params>,
  Book[]
> = async (req, res) => {
  const { authorId } = req.params;
  res.json(await Book.getBooksByAuthorId(parseInt(authorId)));
};

export const addBook: RequestHandler<
  {},
  { message: string; data: Book },
  Partial<Book>
> = async (req, res) => {
  const { name = "", authorId = 1 } = req.body;
  const book = await Book.addBook({ name, authorId });
  if (!book) throw new Error("Failed to add book");

  res.status(201).json({ message: "New book Added", data: book });
};

export const editBook: RequestHandler<
  Partial<typeof ROUTEMAP.books._params>,
  { message: string; data: Book },
  Partial<Book>
> = async (req, res) => {
  const { name = "", authorId = 1 } = req.body;
  const { id } = req.params;
  console.log(req.params, req.body);

  const book = await Book.editBook(parseInt(id), { name, authorId });
  if (!book) throw new Error("Failed to update the book");

  res.json({
    message: "Book has been updated",
    data: { ...book, id: parseInt(id) },
  });
};

export const deleteBook: RequestHandler<
  Partial<typeof ROUTEMAP.books._params>
> = async (req, res) => {
  const { id } = req.params;
  res.json(await Book.deleteBook(parseInt(id)));
};
