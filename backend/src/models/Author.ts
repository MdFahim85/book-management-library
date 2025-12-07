import { eq, InferSelectModel } from "drizzle-orm";
import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

import { db } from "../config/database";

// Author Schema
export const author = pgTable("author", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
});

// Author Schema Validators
export const addAuthorSchema = createInsertSchema(author, {
  name: (schema) => schema.min(3).max(255),
});
export const updateAuthorSchema = createUpdateSchema(author, {
  name: (schema) => schema.min(3).max(255),
});

// Author type
export type Author = InferSelectModel<typeof author>;

// Author Model
export default class AuthorModel {
  static async getAllAuthors(): Promise<Author[]> {
    const authors = await db.select().from(author);
    return authors;
  }

  static async getAuthorById(id: number): Promise<Author | undefined> {
    const authors = await db
      .select()
      .from(author)
      .where(eq(author.id, id))
      .limit(1);
    return authors[0];
  }

  static async addAuthor(
    authorData: Pick<Author, "name">
  ): Promise<Author | undefined> {
    const [newAuthor] = await db.insert(author).values(authorData).returning();
    if (!newAuthor) return undefined;
    return newAuthor satisfies Author;
  }

  static async editAuthor(
    id: number,
    authorData: Partial<Author>
  ): Promise<Author | undefined> {
    const [updatedAuthor] = await db
      .update(author)
      .set(authorData)
      .where(eq(author.id, id))
      .returning();
    return updatedAuthor;
  }
  static async deleteAuthor(id: number): Promise<string | undefined> {
    const result = await db.delete(author).where(eq(author.id, id)).returning();
    if (!result.length) return undefined;
    return `Author with id ${id} deleted`;
  }
}
