import { eq, InferSelectModel } from "drizzle-orm";
import { integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import z from "zod";

import { db } from "../config/database";
import { author } from "./Author";
import { user } from "./User";

// Book Schema
export const book = pgTable("book", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  authorId: integer("authorId")
    .notNull()
    .references(() => author.id, { onDelete: "cascade" }),
  createdBy: integer("createdBy")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  fileUrl: text("fileUrl").notNull(),
});

// Book schema validators
export const insertBookSchema = createInsertSchema(book, {
  id: (schema) => schema.transform(() => undefined),
  name: (schema) => schema.min(3).max(255),
  authorId: () => z.coerce.number().int().gt(0),
  createdBy: () => z.coerce.number().int().gt(0),
});
export const updateBookSchema = createUpdateSchema(book, {
  id: (schema) => schema.transform(() => undefined),
  name: (schema) => schema.min(3).max(255),
  authorId: () => z.coerce.number().int().gt(0),
  createdBy: () => z.coerce.number().int().gt(0),
});

// Book type
export type Book = InferSelectModel<typeof book>;

// Book Model
export default class BookModel {
  // Get all books
  static getAllBooks = async (dbOrTx: DbOrTx = db) => {
    const books = await dbOrTx.select().from(book);
    return books;
  };

  // Get book by id
  static getBookById = async (id: number, dbOrTx: DbOrTx = db) => {
    const books = await dbOrTx
      .select()
      .from(book)
      .where(eq(book.id, id))
      .limit(1);
    return books[0];
  };

  static getBookDetailsById = async (id: number, dbOrTx: DbOrTx = db) => {
    const books = await dbOrTx
      .select({
        id: book.id,
        name: book.name,
        authorId: book.authorId,
        authorName: author.name,
        createdBy: book.createdBy,
        createdByName: user.name,
        fileUrl: book.fileUrl,
      })
      .from(book)
      .leftJoin(user, eq(user.id, book.createdBy))
      .leftJoin(author, eq(author.id, book.authorId))
      .where(eq(book.id, id))
      .limit(1);
    return books[0];
  };

  // Get book by author id
  static getBooksByAuthorId = async (authorId: number, dbOrTx: DbOrTx = db) => {
    const books = await dbOrTx
      .select()
      .from(book)
      .where(eq(book.authorId, authorId));
    return books;
  };

  // Add a new book
  static addBook = async (bookData: InsertModel<Book>, dbOrTx: DbOrTx = db) => {
    const [newBook] = await dbOrTx.insert(book).values(bookData).returning();
    if (!newBook) return undefined;
    return newBook satisfies Book;
  };

  // Edit book
  static editBook = async (
    id: number,
    bookData: Partial<Book>,
    dbOrTx: DbOrTx = db
  ) =>
    (
      await dbOrTx.update(book).set(bookData).where(eq(book.id, id)).returning()
    )[0];

  // Delete book
  static deleteBook = async (id: number, dbOrTx: DbOrTx = db) => {
    const result = await dbOrTx.delete(book).where(eq(book.id, id));
    if (!result.rowCount) return undefined;
    return "books.bookDeleteSuccess";
  };
}
