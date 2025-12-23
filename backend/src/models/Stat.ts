import { and, eq, InferSelectModel, sql } from "drizzle-orm";
import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import z from "zod";

import { db } from "../config/database";
import { book } from "./Book";
import { user } from "./User";

// Stats Schema
export const stat = pgTable(
  "stat",
  {
    bookId: integer("bookId")
      .notNull()
      .references(() => book.id, { onDelete: "cascade" }),

    userId: integer("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    pagesRead: integer("pagesRead").notNull().default(1),
    readTimeSeconds: integer("readTimeSeconds").notNull().default(0),
  },
  (table) => [
    primaryKey({ name: "statPK", columns: [table.bookId, table.userId] }),
  ]
);

// Stat schema validators
export const insertStatSchema = createInsertSchema(stat, {
  bookId: () => z.coerce.number().int().gt(0),
  userId: () => z.coerce.number().int().gt(0),
  pagesRead: () => z.coerce.number().int().gt(0),
  readTimeSeconds: () => z.coerce.number().int().gte(0),
});

// Stat type
export type Stat = InferSelectModel<typeof stat>;

// Stat Model
export default class StatModel {
  // Single Book stats
  static getBookStats = async (bookId: number, dbOrTx: DbOrTx = db) => {
    const bookStats = await dbOrTx
      .select()
      .from(stat)
      .where(eq(stat.bookId, bookId));

    return bookStats;
  };

  // User stats of a particular book
  static getBookByUserStats = async (
    bookId: number,
    userId: number,
    dbOrTx: DbOrTx = db
  ) => {
    const bookByUserStats = await dbOrTx
      .select()
      .from(stat)
      .where(and(eq(stat.bookId, bookId), eq(stat.userId, userId)));

    //Return the first result
    return bookByUserStats[0];
  };

  // Add Book stats
  static addBookByUserStats = async (
    bookStatByUser: Stat,
    dbOrTx: DbOrTx = db
  ) => {
    const [bookStat] = await dbOrTx
      .insert(stat)
      .values(bookStatByUser)
      .onConflictDoUpdate({
        target: [stat.bookId, stat.userId],
        set: {
          readTimeSeconds: sql`${stat.readTimeSeconds} + ${bookStatByUser.readTimeSeconds}`,
          pagesRead: sql`GREATEST(${stat.pagesRead}, ${bookStatByUser.pagesRead})`,
        },
      })
      .returning();

    if (!bookStat) return undefined;
    return bookStat satisfies Stat;
  };
}
