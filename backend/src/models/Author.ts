import { eq, InferSelectModel } from "drizzle-orm";
import {
  integer,
  PgTable,
  pgTable,
  serial,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

import { db } from "../config/database";
import { user } from "./User";
import z from "zod";

// Author Schema
export const author = pgTable("author", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdBy: integer("createdBy")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

// Author Schema Validators
export const addAuthorSchema = createInsertSchema(author, {
  id: (schema) => schema.transform(() => undefined),
  name: (schema) => schema.min(3).max(255),
  createdBy: () => z.coerce.number().int().gt(0),
});
export const updateAuthorSchema = createUpdateSchema(author, {
  id: (schema) => schema.transform(() => undefined),
  name: (schema) => schema.min(3).max(255),
  createdBy: () => z.coerce.number().int().gt(0),
});

// Author type
export type Author = InferSelectModel<typeof author>;

// Author Model
export default class AuthorModel {
  // Get all authors
  static getAllAuthors = async () => {
    const authors = await db.select().from(author);
    return authors;
  };

  // Get author by id
  static getAuthorById = async (id: number) => {
    const authors = await db
      .select()
      .from(author)
      .where(eq(author.id, id))
      .limit(1);
    return authors[0];
  };

  static getAuthorDetailsById = async (id: number) => {
    const authors = await db
      .select({
        id: author.id,
        name: author.name,
        createdBy: author.createdBy,
        createdByName: user.name,
      })
      .from(author)
      .leftJoin(user, eq(user.id, author.createdBy))
      .where(eq(author.id, id))
      .limit(1);
    return authors[0];
  };

  // Add a new author
  static addAuthor = async (authorData: InsertModel<Author>) => {
    const [newAuthor] = await db.insert(author).values(authorData).returning();
    if (!newAuthor) return undefined;
    return newAuthor satisfies Author;
  };

  // Edit author
  static editAuthor = async (id: number, authorData: Partial<Author>) =>
    (
      await db
        .update(author)
        .set(authorData)
        .where(eq(author.id, id))
        .returning()
    )[0];

  // Delete author
  static deleteAuthor = async (id: number) => {
    const result = await db.delete(author).where(eq(author.id, id));
    if (!result.rowCount) return undefined;
    return `Author with id ${id} deleted`;
  };
}
