const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const hash = '$2b$10$.JjF48qNq8Fm/qLbt6YMPuECSTvKBKAZ5PscUKwUiv/1e3WcD9XHu';

const pool = new Pool({
  connectionString: 'postgresql://postgres:vw2pcb%2BQ%23w_7RdW@db.adxfaucqbocnlrfcamqs.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false },
});

pool.query("UPDATE users SET senha = $1 WHERE email = 'admin@centraldivas.com'", [hash])
  .then(() => console.log('Senha atualizada!'))
  .catch(e => console.log(e.message))
  .finally(() => pool.end());
