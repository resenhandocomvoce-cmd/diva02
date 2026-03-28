import { Pool } from 'pg';

const password = process.env.DB_PASSWORD || '';
const encodedPassword = encodeURIComponent(password);
const connectionString = `postgresql://${process.env.DB_USER}:${encodedPassword}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

export default pool;
