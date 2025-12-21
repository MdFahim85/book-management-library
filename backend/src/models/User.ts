import { eq, InferSelectModel } from "drizzle-orm";
import { pgEnum, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import z from "zod";

import { db } from "../config/database";

export const themeEnum = pgEnum("theme", ["light", "dark", "system"]);
export const languageEnum = pgEnum("language", ["english", "bangla"]);

// User Schema
export const user = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  theme: themeEnum("theme").notNull().default("light"),
  language: languageEnum("language").notNull().default("english"),
});

// User Schema Validators
export const addUserSchema = createInsertSchema(user, {
  id: (schema) => schema.transform(() => undefined),
  name: (schema) => schema.min(3).max(255),
  password: (schema) => schema.min(6).max(255),
  email: () => z.email().max(255),
  theme: () => z.enum(["light", "dark", "system"]),
  language: () => z.enum(["english", "bangla"]),
});
export const updateUserSchema = createUpdateSchema(user, {
  id: (schema) => schema.transform(() => undefined),
  name: (schema) => schema.min(3).max(255),
  password: (schema) => schema.min(6).max(255),
  email: () => z.email().max(255),
  theme: () => z.enum(["light", "dark", "system"]),
  language: () => z.enum(["english", "bangla"]),
});

// User type
export type User = InferSelectModel<typeof user>;

export type UserWithOutPassword = Omit<User, "password">;

// User Model
export default class UserModel {
  // Get user by email
  static getUserByEmail = async (email: string, dbOrTx: DbOrTx = db) => {
    const users = await dbOrTx
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);
    return users[0];
  };

  // Get user by id
  static getUserById = async (id: number, dbOrTx: DbOrTx = db) => {
    const users = await dbOrTx
      .select()
      .from(user)
      .where(eq(user.id, id))
      .limit(1);
    return users[0];
  };

  // Add a new user
  static addUser = async (userData: InsertModel<User>, dbOrTx: DbOrTx = db) => {
    const [newUser] = await dbOrTx.insert(user).values(userData).returning();
    if (!newUser) return undefined;
    return newUser satisfies User;
  };

  // Edit user
  static editUser = async (
    id: number,
    userData: Partial<User>,
    dbOrTx: DbOrTx = db
  ) => {
    const [updatedUser] = await dbOrTx
      .update(user)
      .set(userData)
      .where(eq(user.id, id))
      .returning();
    return updatedUser;
  };

  // Delete user
  static deleteUser = async (id: number, dbOrTx: DbOrTx = db) => {
    const result = await dbOrTx.delete(user).where(eq(user.id, id));
    if (!result.rowCount) return undefined;
    return `User with id ${id} deleted`;
  };
}
