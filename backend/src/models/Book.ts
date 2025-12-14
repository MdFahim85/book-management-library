import { eq, InferSelectModel } from "drizzle-orm";
import { integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import z from "zod";

import { db } from "../config/database";
import { author } from "./Author";

// Book Schema
export const book = pgTable("book", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  authorId: integer("authorId")
    .notNull()
    .references(() => author.id),
  fileUrl: text("fileUrl").notNull(),
});

// Book schema validators
export const insertBookSchema = createInsertSchema(book, {
  id: (schema) => schema.transform(() => undefined),
  name: (schema) => schema.min(3).max(255),
  authorId: () => z.coerce.number().int().gt(0),
});
export const updateBookSchema = createUpdateSchema(book, {
  id: (schema) => schema.transform(() => undefined),
  name: (schema) => schema.min(3).max(255),
  authorId: () => z.coerce.number().int().gt(0),
});

// Book type
export type Book = InferSelectModel<typeof book>;

// Book Model
export default class BookModel {
  static getAllBooks = async (dbOrTx: DbOrTx = db) => {
    const books = await dbOrTx.select().from(book);
    return books;
  };

  static getBookById = async (id: number, dbOrTx: DbOrTx = db) => {
    const books = await dbOrTx
      .select()
      .from(book)
      .where(eq(book.id, id))
      .limit(1);
    return books[0];
  };

  static getBooksByAuthorId = async (authorId: number, dbOrTx: DbOrTx = db) => {
    const books = await dbOrTx
      .select()
      .from(book)
      .where(eq(book.authorId, authorId));
    return books;
  };

  static addBook = async (bookData: InsertModel<Book>, dbOrTx: DbOrTx = db) => {
    const [newBook] = await dbOrTx.insert(book).values(bookData).returning();
    if (!newBook) return undefined;
    return newBook satisfies Book;
  };

  static editBook = async (
    id: number,
    bookData: Partial<Book>,
    dbOrTx: DbOrTx = db
  ) =>
    (
      await dbOrTx.update(book).set(bookData).where(eq(book.id, id)).returning()
    )[0];

  static deleteBook = async (id: number, dbOrTx: DbOrTx = db) => {
    const result = await dbOrTx.delete(book).where(eq(book.id, id));
    if (!result.rowCount) return undefined;
    return `Book with id ${id} deleted`;
  };
}
