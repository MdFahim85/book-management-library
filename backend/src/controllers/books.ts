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
import path from "path";
import config from "../config";

// Get all books
export const getBooks: RequestHandler<{}, Book[]> = async (_, res) => {
  res.json(await BookModel.getAllBooks());
};

// Get book details
export const getBookDetails: RequestHandler<
  Partial<typeof ROUTEMAP.books._params>
> = async (req, res) => {
  // Id validation
  const { id } = await idValidator.parseAsync(req.params);

  // Book lookup
  const book = await BookModel.getBookById(id);

  // Throw on failed query
  if (!book) throw new ResponseError("No book found", status.NOT_FOUND);

  res.json(book);
};

// Get books by author id
export const getBooksByAuthorId: RequestHandler<
  Partial<typeof ROUTEMAP.books._params>,
  Book[]
> = async (req, res) => {
  // author id validation
  const { authorId } = await authorIdValidator.parseAsync(req.params);

  // Get books of author
  const booksByAuthor = await BookModel.getBooksByAuthorId(authorId);

  // Throw on failed query
  if (!booksByAuthor.length)
    throw new ResponseError(
      "No books found under this author",
      status.NOT_FOUND
    );

  res.json(booksByAuthor);
};

// Add a new book
export const addBook: RequestHandler<
  {},
  { message: string; data: Book },
  Partial<Book> & { json?: string }
> = async (req, res) => {
  // Read files from multer
  const { fileUrl } = req.files as {
    [key in keyof Book]?: Express.Multer.File[];
  };

  // Throw if no file
  if (!fileUrl?.[0])
    throw new ResponseError("Please attach a pdf", status.BAD_REQUEST);

  // set book path to file path
  const json: Book = JSON.parse(req.body.json || "");
  json.fileUrl = fileUrl[0].filename;

  // DB transaction
  const book = await db.transaction(async (tx) => {
    const result = await BookModel.addBook(
      await insertBookSchema.parseAsync(json),
      tx
    );

    // Rollback and throw on error
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

// Edit book
export const editBook: RequestHandler<
  Partial<typeof ROUTEMAP.books._params>,
  { message: string; data: Book },
  Partial<Book> & { json?: string }
> = async (req, res) => {
  // Id validation
  const { id } = await idValidator.parseAsync(req.params);

  // Read files from multer
  const { fileUrl } = req.files as {
    [key in keyof Book]?: Express.Multer.File[];
  };

  const json: Book = JSON.parse(req.body.json || "");
  const newFilePath = fileUrl?.[0]?.path;

  //Set book path to file path if new file is provided
  if (fileUrl?.[0]?.size) {
    json.fileUrl = fileUrl[0].filename;
  }

  // DB transaction
  const book = await db.transaction(async (tx) => {
    // Old book lookup
    const oldBook = await BookModel.getBookById(id, tx);
    if (!oldBook) throw new ResponseError("Book not found", status.NOT_FOUND);

    const result = await BookModel.editBook(
      id,
      await updateBookSchema.parseAsync(json),
      tx
    );

    // Rollback and throw on error
    if (!result) {
      if (newFilePath && (await fileExists(newFilePath))) {
        await fs.unlink(newFilePath);
      }
      tx.rollback();
      throw new ResponseError("Failed to update the book", status.BAD_REQUEST);
    }

    const oldBookPath = path.join(config.uploadDir, oldBook.fileUrl);
    // If new file is uploaded then delete prev one and update the file url
    if (newFilePath && oldBookPath && (await fileExists(oldBookPath))) {
      await fs.unlink(oldBookPath);
    }

    return result;
  });

  res.json({ message: "Book has been updated", data: book });
};

// Delete book
export const deleteBook: RequestHandler<
  Partial<typeof ROUTEMAP.books._params>
> = async (req, res) => {
  // Id validation
  const { id } = await idValidator.parseAsync(req.params);

  // DB transaction
  const deleteMessage = await db.transaction(async (tx) => {
    // Book lookup
    const deletedBook = await BookModel.getBookById(id, tx);

    // Throw on failed query
    if (!deletedBook)
      throw new ResponseError("No book found", status.NOT_FOUND);

    // Transaction start
    const result = await BookModel.deleteBook(id, tx);

    // Rollback on failed query
    if (!result) {
      tx.rollback();
      throw new ResponseError("Failed to delete book", status.BAD_REQUEST);
    }

    const deletedBookPath = path.join(config.uploadDir, deletedBook.fileUrl);
    // Delete book file
    if (await fileExists(deletedBookPath)) await fs.unlink(deletedBookPath);
    return result;
  });

  res.json({ message: deleteMessage });
};
