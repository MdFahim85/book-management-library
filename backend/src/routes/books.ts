import express from "express";

import { upload } from "../controllers/_middlewares";
import {
  addBook,
  deleteBook,
  editBook,
  getBookDetails,
  getBooks,
  getBooksByAuthorId,
} from "../controllers/books";
import ROUTEMAP from "./ROUTEMAP";

const booksRouter = express.Router();

booksRouter.get(ROUTEMAP.books.get, getBooks);
booksRouter.get(ROUTEMAP.books.getById, getBookDetails);
booksRouter.get(ROUTEMAP.books.getByAuthorId, getBooksByAuthorId);
booksRouter.post(ROUTEMAP.books.post, upload.single("bookPdf"), addBook);
booksRouter.put(ROUTEMAP.books.put, upload.single("bookPdf"), editBook);
booksRouter.delete(ROUTEMAP.books.delete, deleteBook);

export default booksRouter;
