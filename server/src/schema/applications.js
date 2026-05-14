import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  date,
} from "drizzle-orm/pg-core";

// Define the applications table schema using Drizzle ORM
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  company: text("company").notNull(),
  position: text("position").notNull(),
  status: text("status").default("Applied"),
  applicationDate: date("application_date"),
  jobLink: text("job_link"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});