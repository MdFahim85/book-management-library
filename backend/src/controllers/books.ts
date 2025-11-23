import { RequestHandler } from "express";

import Book from "../models/Book";

export const getBooks: RequestHandler = async (_, res) =>
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
  Pick<Book, "authorId">
> = async (req, res) => {
  const { authorId } = req.params;
  const book = await Book.getBooksByAuthorId(authorId);
  if (!book) throw new Error("No book found under this author");
  res.json(book);
};

export const addBook: RequestHandler<
  {},
  { message: string; data: Book },
  Partial<Book>
> = async (req, res) => {
  const { name = "", authorId = 1 } = req.body;
  const book = await Book.addBook({ name, authorId });
  if (!book) throw new Error("book not added");

  res.status(201).json({ message: "New book Added", data: book });
};

export const editBook: RequestHandler<
  Pick<Book, "id">,
  { message: string; data: Book },
  Partial<Book>
> = async (req, res) => {
  const { name = "", authorId = 1 } = req.body;
  const { id } = req.params;
  const book = await Book.editBook(id, { name, authorId });
  if (!book) throw new Error("Failed to update the book");

  res.json({ message: "Book has been updated", data: { ...book, id } });
};

export const deleteBook: RequestHandler<Pick<Book, "id">> = async (
  req,
  res
) => {
  const { id } = req.params;
  res.json(await Book.deleteBook(id));
};
