import { RequestHandler } from "express";

import Author from "../models/Author";

export const getAuthors: RequestHandler = async (_, res, next) => {
  try {
    res.json(await Author.getAllAuthors());
  } catch (error) {
    next(error);
  }
};

export const getAuthorById: RequestHandler<Pick<Author, "id">> = async (
  req,
  res
) => {
  const { id } = req.params;
  const author = await Author.getAuthorById(id);
  if (!author) throw new Error("No author found");
  res.json(author);
};

export const addAuthor: RequestHandler<
  {},
  { message: string; data: Author },
  Partial<Author>
> = async (req, res) => {
  const { name = "" } = req.body;
  const author = await Author.addAuthor({ name });
  if (!author) throw new Error("Author not added");
  res.status(201).json({ message: "New author Added", data: author });
};

export const editAuthor: RequestHandler<
  Pick<Author, "id">,
  { message: string; data: Author },
  Partial<Author>
> = async (req, res) => {
  const { name = "" } = req.body;
  const { id } = req.params;
  const author = await Author.editAuthor(id, { name });
  if (!author) throw new Error("Failed to update the book");
  res.json({ message: "Author has been updated", data: { ...author, id } });
};

export const deleteAuthor: RequestHandler<{ id: number }> = async (
  req,
  res
) => {
  const { id } = req.params;
  res.json(await Author.deleteAuthor(id));
};
