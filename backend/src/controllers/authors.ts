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

// Get author by id
export const getAuthorById: RequestHandler<
  Partial<typeof ROUTEMAP.authors._params>,
  Author
> = async (req, res) => {
  // Id validation
  const { id } = await idValidator.parseAsync(req.params);

  // Author lookup
  const author = await AuthorModel.getAuthorById(id);
  if (!author) throw new ResponseError("No author found", status.NOT_FOUND);

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
  if (!author) throw new ResponseError("Author not added", status.BAD_REQUEST);

  res.status(201).json({ message: "New author Added", data: author });
};

// Edit author
export const editAuthor: RequestHandler<
  Partial<typeof ROUTEMAP.authors._params>,
  { message: string; data: Author },
  Partial<Author>
> = async (req, res) => {
  // Id validation
  const { id } = await idValidator.parseAsync(req.params);

  // Author update
  const author = await AuthorModel.editAuthor(
    id,
    await updateAuthorSchema.parseAsync(req.body)
  );
  // Throw on failed query
  if (!author)
    throw new ResponseError("Failed to update author", status.BAD_REQUEST);

  res.json({ message: "Author has been updated", data: author });
};

// Delete author
export const deleteAuthor: RequestHandler<
  Partial<typeof ROUTEMAP.authors._params>
> = async (req, res) => {
  // Id validation
  const { id } = await idValidator.parseAsync(req.params);

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
  const deletedAuthor = await AuthorModel.deleteAuthor(id);

  // Throw on failed query
  if (!deletedAuthor)
    throw new ResponseError("Failed to delete author", status.BAD_REQUEST);

  res.json(deletedAuthor);
};
