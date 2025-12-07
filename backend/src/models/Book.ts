import { eq, InferSelectModel } from "drizzle-orm";
import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

import { db } from "../config/database";
import { author } from "./Author";
import z from "zod";

// Book Schema
export const book = pgTable("book", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  authorId: integer("authorId")
    .notNull()
    .references(() => author.id),
});

// Book schema validators
export const insertBookSchema = createInsertSchema(book, {
  name: (schema) => schema.min(3).max(255),
  authorId: () => z.coerce.number().int().gt(0),
});
export const updateBookSchema = createUpdateSchema(book, {
  name: (schema) => schema.min(3).max(255),
  authorId: () => z.coerce.number().int().gt(0),
});

// Book type
export type Book = InferSelectModel<typeof book>;

// Book Model
export default class BookModel {
  static async getAllBooks(): Promise<Book[]> {
    const books = await db.select().from(book);
    return books;
  }

  static async getBookById(id: number): Promise<Book | undefined> {
    const books = await db.select().from(book).where(eq(book.id, id)).limit(1);
    return books[0];
  }

  static async getBooksByAuthorId(authorId: number): Promise<Book[]> {
    const books = await db
      .select()
      .from(book)
      .where(eq(book.authorId, authorId));
    return books;
  }

  static async addBook(
    bookData: Pick<Book, "name" | "authorId">
  ): Promise<Book | undefined> {
    const [newBook] = await db.insert(book).values(bookData).returning();
    if (!newBook) return undefined;
    return newBook satisfies Book;
  }
  static async editBook(
    id: number,
    bookData: Partial<Book>
  ): Promise<Book | undefined> {
    const [updatedBook] = await db
      .update(book)
      .set(bookData)
      .where(eq(book.id, id))
      .returning();
    return updatedBook;
  }

  static async deleteBook(id: number): Promise<string | undefined> {
    const result = await db.delete(book).where(eq(book.id, id)).returning();
    if (!result.length) return undefined;
    return `Book with id ${id} deleted`;
  }
}
