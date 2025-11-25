import { InferSelectModel } from "drizzle-orm";
import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

export const author = pgTable("author", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const addAuthorSchema = createInsertSchema(author);
export const updateAuthorSchema = createUpdateSchema(author);
export const authorIdParamSchema = z
  .string()
  .regex(/^\d+$/, "Invalid ID")
  .transform((val) => Number(val));

export type Author = InferSelectModel<typeof author>;
