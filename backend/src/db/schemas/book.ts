import { InferSelectModel } from "drizzle-orm";
import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

import { author } from "./author";

export const book = pgTable("book", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  authorId: integer("authorId")
    .notNull()
    .references(() => author.id),
});

export const insertBookSchema = createInsertSchema(book);
export const updateBookSchema = createUpdateSchema(book);
export const bookIdParamSchema = z
  .string()
  .regex(/^\d+$/, "Invalid ID")
  .transform((val) => Number(val));
export const bookAuthorIdParamSchema = z
  .string()
  .regex(/^\d+$/, "Invalid ID")
  .transform((val) => Number(val));
export type Book = InferSelectModel<typeof book>;
