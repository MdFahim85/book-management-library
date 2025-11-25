import { eq } from "drizzle-orm";

import { db } from "../config/database";
import { book, Book } from "../db/schemas/book";

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
