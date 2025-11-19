// DB/config.js
import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

export const client = new Client({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: { rejectUnauthorized: false },
   connectionTimeoutMillis: 30000 
});
