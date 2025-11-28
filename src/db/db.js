import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  user: process.env.DB_USER || "admin",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "hu12db",
  password: process.env.DB_PASS || "admin123",
  port: process.env.DB_PORT || 5433
});
