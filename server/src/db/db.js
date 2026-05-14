import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";

dotenv.config();

// Initialize PostgreSQL connection pool using the connection string from environment variables
const { Pool } = pkg;

// Create a new connection pool with SSL configuration for secure connections
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const db = drizzle(pool);