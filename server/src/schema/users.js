import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Users Table Schema
 * Stores user account information
 */
export const users = pgTable("users", {
  uuid: uuid("uuid").primaryKey().defaultRandom(),

  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});