import { Pool } from 'pg';

const password = process.env.DB_PASSWORD || '';
const encodedPassword = encodeURIComponent(password);
const host = process.env.DB_HOST || 'db.adxfaucqbocnlrfcamqs.supabase.co';
const port = '6543';
const connectionString = `postgresql://postgres:${encodedPassword}@${host}:${port}/postgres`;

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

export default pool;
