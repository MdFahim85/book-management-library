import pgClient from "../config/pgClient";

export default class Book {
  id!: number;
  name!: string;
  authorId!: number;

  static async getAllBooks() {
    const { rows: books } = await pgClient.query<Book>(
      /*sql*/ `SELECT * FROM "book"`
    );

    return books;
  }
  static async getBookById(id: number) {
    const { rows: books } = await pgClient.query<Book>(
      /*sql*/ `SELECT * FROM "book" WHERE "id" = ($1) LIMIT 1`,
      [id]
    );

    return books[0];
  }
  static async getBooksByAuthorId(authorId: number) {
    const { rows: books } = await pgClient.query<Book>(
      /*sql*/ `SELECT * FROM "book" WHERE "author_id" = ($1)`,
      [authorId]
    );

    return books[0];
  }
  static async addBook(book: Pick<Book, "name" | "authorId">) {
    const { rowCount, oid } = await pgClient.query(
      /*sql*/ `INSERT INTO "book" ("name", "author_id") VALUES ($1, $2)`,
      [book.name, book.authorId]
    );

    if (!rowCount) return undefined;

    return { ...book, id: oid } satisfies Book;
  }
  static async editBook(id: number, book: Pick<Book, "name" | "authorId">) {
    const { rowCount } = await pgClient.query(
      /*sql*/ `UPDATE "book" SET "name" = ($1), "author_id" = ($2) WHERE "id" = ($3)`,
      [book.name, book.authorId, id]
    );
    if (!rowCount) return undefined;

    return book;
  }

  static async deleteBook(id: number) {
    const { rowCount } = await pgClient.query(
      /*sql*/ `DELETE FROM book WHERE id=($1)`,
      [id]
    );
    if (!rowCount) return undefined;
    return `Book with id ${id} deleted`;
  }
}
