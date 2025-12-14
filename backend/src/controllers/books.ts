import { RequestHandler } from "express";
import { promises as fs } from "fs";
import status from "http-status";

import { db } from "../config/database";
import BookModel, {
  type Book,
  insertBookSchema,
  updateBookSchema,
} from "../models/Book";
import ROUTEMAP from "../routes/ROUTEMAP";
import { fileExists } from "../utils";
import ResponseError from "../utils/ResponseError";
import { authorIdValidator, idValidator } from "../utils/validators";

export const getBooks: RequestHandler<{}, Book[]> = async (_, res) => {
  res.json(await BookModel.getAllBooks());
};
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
  const booksByAuthor = await BookModel.getBooksByAuthorId(authorId);
  if (!booksByAuthor.length)
    throw new ResponseError(
      "No books found under this author",
      status.NOT_FOUND
    );
  res.json(booksByAuthor);
};

export const addBook: RequestHandler<
  {},
  { message: string; data: Book },
  Partial<Book> & { json?: string }
> = async (req, res) => {
  const { fileUrl } = req.files as {
    [key in keyof Book]?: Express.Multer.File[];
  };

  if (!fileUrl?.[0])
    throw new ResponseError("Please attach a pdf", status.BAD_REQUEST);

  const json: Book = JSON.parse(req.body.json || "");
  json.fileUrl = fileUrl[0].filename;

  const book = await db.transaction(async (tx) => {
    const result = await BookModel.addBook(
      await insertBookSchema.parseAsync(json),
      tx
    );
    if (!result) {
      if (await fileExists(fileUrl![0]!.path))
        await fs.unlink(fileUrl![0]!.path);
      tx.rollback();
      throw new ResponseError("Failed to add book", status.BAD_REQUEST);
    }
    return result;
  });

  res.status(201).json({ message: "New book Added", data: book });
};

export const editBook: RequestHandler<
  Partial<typeof ROUTEMAP.books._params>,
  { message: string; data: Book },
  Partial<Book> & { json?: string }
> = async (req, res) => {
  const { id } = await idValidator.parseAsync(req.params);
  const { fileUrl } = req.files as {
    [key in keyof Book]?: Express.Multer.File[];
  };

  const json: Book = JSON.parse(req.body.json || "");

  if (fileUrl?.[0]) json.fileUrl = fileUrl[0].filename;

  const oldBook = await BookModel.getBookById(id);
  if (!oldBook) throw new ResponseError("Book not found", status.NOT_FOUND);

  const book = await db.transaction(async (tx) => {
    const result = await BookModel.editBook(
      id,
      await updateBookSchema.parseAsync(json),
      tx
    );
    if (!result) {
      if (await fileExists(fileUrl![0]!.path))
        await fs.unlink(fileUrl![0]!.path);
      tx.rollback();
      throw new ResponseError("Failed to update the book", status.BAD_REQUEST);
    }
    if (await fileExists(oldBook.fileUrl)) await fs.unlink(oldBook.fileUrl);

    return result;
  });
  res.json({ message: "Book has been updated", data: book });
};

export const deleteBook: RequestHandler<
  Partial<typeof ROUTEMAP.books._params>
> = async (req, res) => {
  const { id } = await idValidator.parseAsync(req.params);

  const isDeleted = await db.transaction(async (tx) => {
    const deletedBook = await BookModel.getBookById(id, tx);
    if (!deletedBook)
      throw new ResponseError("No book found", status.NOT_FOUND);
    const result = await BookModel.deleteBook(id, tx);
    if (!result) {
      tx.rollback();
      throw new ResponseError("Failed to delete book", status.BAD_REQUEST);
    }

    if (await fileExists(deletedBook.fileUrl))
      await fs.unlink(deletedBook.fileUrl);
    return result;
  });

  res.json(isDeleted);
};
