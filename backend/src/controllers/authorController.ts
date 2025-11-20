import { Request, Response } from "express";
const { client } = require("../config/dbConfig");

export const getAuthors = async (_req: Request, res: Response) => {
  try {
    const { rows: authors } = await client.query("select * from author");
    res.json({ authors });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
};

export const addAuthor = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    await client.query("insert into author (name) values ($1)", [name]);
    res.json({ message: "New author Added" });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
};

export const editAuthor = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const { authorId } = req.params;
    await client.query("update author set name = ($1) where id = ($2)", [
      name,
      authorId,
    ]);
    res.json({ message: "Author Updated" });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
};

export const deleteAuthor = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;
    await client.query("delete from author where id = ($1)", [authorId]);
    res.json({ message: "Author deleted" });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
};

export const getAuthorBooks = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;
    const { rows: booksByAuthor } = await client.query(
      "select * from author join book on book.author_id = author.id where author.id = ($1) ",
      [authorId]
    );
    res.json({ booksByAuthor });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
};
