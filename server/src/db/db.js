import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";

dotenv.config();

const { Pool } = pkg;

/**
 * PostgreSQL Connection Pool
 * Configured for both Development and Production environments
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  
  // Smart SSL Configuration
  ssl: process.env.NODE_ENV === "production" 
    ? { rejectUnauthorized: false }   // Required for most hosting platforms (Render, Railway, etc.)
    : false,                          // Disabled for local development
});

/**
 * Drizzle ORM Database Instance
 */
export const db = drizzle(pool);

export default db;