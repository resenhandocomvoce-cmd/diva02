const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:vw2pcb%2BQ%23w_7RdW@db.adxfaucqbocnlrfcamqs.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false },
});

const schema = `
-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    whatsapp VARCHAR(20),
    senha VARCHAR(255) NOT NULL,
    foto_perfil TEXT,
    tipo VARCHAR(20) DEFAULT 'user' CHECK (tipo IN ('superadmin', 'admin', 'user')),
    status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'ativa', 'inativa', 'bloqueada')),
    penalidades INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de tarefas
CREATE TABLE IF NOT EXISTS tarefas (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('curtir', 'comentar', 'seguir', 'outro')),
    descricao TEXT NOT NULL,
    ativa BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de posts do dia
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    link TEXT NOT NULL,
    usuario_id INTEGER REFERENCES users(id),
    descricao TEXT,
    data DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de conclusões de tarefas
CREATE TABLE IF NOT EXISTS conclusoes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES users(id),
    tarefa_id INTEGER REFERENCES tarefas(id),
    post_id INTEGER REFERENCES posts(id),
    status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'concluida', 'verificada')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de atividades/histórico
CREATE TABLE IF NOT EXISTS atividades (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES users(id),
    acao VARCHAR(100) NOT NULL,
    descricao TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir tarefas padrão
INSERT INTO tarefas (tipo, descricao) VALUES 
('curtir', 'Curtir o post do dia'),
('comentar', 'Comentar no post do dia'),
('seguir', 'Seguir a conta do post')
ON CONFLICT DO NOTHING;

-- Inserir superadmin padrão (senha: admin123)
INSERT INTO users (nome, email, whatsapp, senha, tipo, status) 
VALUES ('Dona Central', 'admin@centraldivas.com', '5511999999999', '$2a$10$rQEY7zNhPMTJ8YqwC5VwXu2YqX5vN5m5F5vN5m5F5vN5m5F5vN5m5F', 'superadmin', 'ativa')
ON CONFLICT (email) DO NOTHING;
`;

async function setup() {
  try {
    console.log('🔌 Conectando ao Supabase...');
    await pool.query(schema);
    console.log('✅ Tabelas criadas com sucesso!');
    
    const result = await pool.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'');
    console.log('📋 Tabelas:', result.rows.map(r => r.table_name).join(', '));
    
    await pool.end();
  } catch (err) {
    console.error('❌ Erro:', err.message);
  }
}

setup();
