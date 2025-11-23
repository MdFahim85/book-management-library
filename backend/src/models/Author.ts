import pgClient from "../config/pgClient";

export default class Author {
  id!: number;
  name!: string;

  static async getAllAuthors() {
    const { rows: authors } = await pgClient.query<Author>(
      /*sql*/ `SELECT * FROM "author"`
    );

    return authors;
  }
  static async getAuthorById(id: number) {
    const { rows: authors } = await pgClient.query<Author>(
      /*sql*/ `SELECT * FROM "author" WHERE "id" = ($1) LIMIT 1`,
      [id]
    );

    return authors[0];
  }
  static async addAuthor(author: Pick<Author, "name">) {
    const { rowCount, oid } = await pgClient.query(
      /*sql*/ `INSERT INTO "author" ("name") VALUES ($1)`,
      [author.name]
    );

    if (!rowCount) return undefined;

    return { ...author, id: oid } satisfies Author;
  }
  static async editAuthor(id: number, author: Pick<Author, "name">) {
    const { rowCount } = await pgClient.query(
      /*sql*/ `UPDATE "author" SET "name" = ($1) WHERE "id" = ($2)`,
      [author.name, id]
    );
    if (!rowCount) return undefined;

    return author;
  }
  static async deleteAuthor(id: number) {
    const { rowCount } = await pgClient.query(
      /*sql*/ `DELETE FROM "author" WHERE "id"=($1)`,
      [id]
    );
    if (!rowCount) return undefined;
    return `Author with id ${id} deleted`;
  }
}
