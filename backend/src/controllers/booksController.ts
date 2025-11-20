import { Request, Response } from "express";
const { client } = require("../config/dbConfig");

export const getBooks = async (_req: Request, res: Response) => {
  try {
    const { rows: books } = await client.query("select * from book");
    res.json({ books });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
};

export const addBook = async (req: Request, res: Response) => {
  try {
    const { name, authorId } = req.body;
    await client.query("insert into book (name, author_id) values ($1,$2)", [
      name,
      authorId,
    ]);
    res.json({ message: "New Book Added" });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
};

export const editBook = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const { bookId } = req.params;
    await client.query("update book set name = ($1) where id = ($2)", [
      name,
      bookId,
    ]);
    res.json({ message: "Book Updated" });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    await client.query("delete from book where id = ($1)", [bookId]);
    res.json({ message: "Book deleted" });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
};
