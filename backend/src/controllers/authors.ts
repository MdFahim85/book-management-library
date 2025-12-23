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
import path from "path";
import config from "../config";

// Get all authors
export const getAuthors: RequestHandler<{}, Author[]> = async (_, res) => {
  res.json(await AuthorModel.getAllAuthors());
};

// Get full author details by id
export const getAuthorDetailsById: RequestHandler<
  Partial<typeof ROUTEMAP.authors._params>,
  {
    id: number;
    name: string;
    createdBy: number;
    createdByName: string | null;
  }
> = async (req, res) => {
  // Id validation
  const { id } = await idValidator.parseAsync(req.params);

  // Author lookup
  const author = await AuthorModel.getAuthorDetailsById(id);
  if (!author) throw new ResponseError("table.noResults", status.NOT_FOUND);

  res.json(author);
};

// Add a new author
export const addAuthor: RequestHandler<
  {},
  { message: string; data: Author },
  Partial<Author>
> = async (req, res) => {
  // Add author
  const author = await AuthorModel.addAuthor(
    await addAuthorSchema.parseAsync(req.body)
  );

  // Throw on failed query
  if (!author)
    throw new ResponseError("authors.authorAddFail", status.BAD_REQUEST);

  res.status(201).json({ message: "authors.authorAddSuccess", data: author });
};

// Edit author
export const editAuthor: RequestHandler<
  Partial<typeof ROUTEMAP.authors._params>,
  { message: string; data: Author },
  Partial<Author>
> = async (req, res) => {
  // Id validation
  const { id } = await idValidator.parseAsync(req.params);
  const user = req.user;

  // Author lookup
  const oldAuthor = await AuthorModel.getAuthorById(id);
  if (!oldAuthor) throw new ResponseError("table.noResults", status.NOT_FOUND);

  // Update permission
  if (oldAuthor.createdBy !== user!.id)
    throw new ResponseError("authors.notAuthorOwner", status.UNAUTHORIZED);

  // Author update
  const author = await AuthorModel.editAuthor(
    id,
    await updateAuthorSchema.parseAsync(req.body)
  );

  // Throw on failed query
  if (!author)
    throw new ResponseError("authors.authorEditFail", status.BAD_REQUEST);

  res.json({ message: "authors.authorEditSuccess", data: author });
};

// Delete author
export const deleteAuthor: RequestHandler<
  Partial<typeof ROUTEMAP.authors._params>
> = async (req, res) => {
  // Id validation
  const { id } = await idValidator.parseAsync(req.params);
  const user = req.user;

  // Author lookup
  const author = await AuthorModel.getAuthorById(id);
  if (!author) throw new ResponseError("table.noResults", status.NOT_FOUND);

  // Delete permission
  if (author.createdBy !== user!.id)
    throw new ResponseError("authors.notAuthorOwner", status.UNAUTHORIZED);

  // Get books of author
  const books = await BookModel.getBooksByAuthorId(id);

  //  Delete book pdfs if they exist
  if (books.length) {
    for (const book of books) {
      if (book.fileUrl) {
        const bookPath = path.join(config.uploadDir, book.fileUrl);
        if (await fileExists(bookPath)) await fs.unlink(bookPath);
      }
    }
  }

  // Delete author
  const deletedMessage = await AuthorModel.deleteAuthor(id);

  // Throw on failed query
  if (!deletedMessage)
    throw new ResponseError("authors.authorDeleteFail", status.BAD_REQUEST);
  res.json({ message: deletedMessage });
};
