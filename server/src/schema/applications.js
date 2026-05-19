import { pgTable, uuid, text, date, timestamp } from "drizzle-orm/pg-core";

/**
 * Applications Table Schema
 * Stores job/internship applications for each user
 */
export const applications = pgTable("applications", {
  uuid: uuid("uuid").primaryKey().defaultRandom(),

  userId: uuid("user_id").notNull(), // Foreign key to users table

  company: text("company").notNull(),
  position: text("position").notNull(),
  status: text("status").default("Applied"),

  applicationDate: date("application_date"),
  jobLink: text("job_link"),
  notes: text("notes"),

  createdAt: timestamp("created_at").defaultNow(),
});