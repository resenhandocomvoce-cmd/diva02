import { Pool } from 'pg';

const password = process.env.DB_PASSWORD || '';
const encodedPassword = encodeURIComponent(password);

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: password,
  ssl: { rejectUnauthorized: false },
});

export default pool;
