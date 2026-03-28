const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:vw2pcb%2BQ%23w_7RdW@db.adxfaucqbocnlrfcamqs.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false },
});

const senhaSimples = 'admin123';

pool.query("UPDATE users SET senha = $1 WHERE email = 'admin@centraldivas.com'", [senhaSimples])
  .then(() => console.log('Senha resetada para texto simples!'))
  .catch(e => console.log(e.message))
  .finally(() => pool.end());
