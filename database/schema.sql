-- Central Divas 2.0 - Schema para Supabase

-- Tabela de usuários
CREATE TABLE users (
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
CREATE TABLE tarefas (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('curtir', 'comentar', 'seguir', 'outro')),
    descricao TEXT NOT NULL,
    ativa BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de posts do dia
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    link TEXT NOT NULL,
    usuario_id INTEGER REFERENCES users(id),
    descricao TEXT,
    data DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de conclusões de tarefas
CREATE TABLE conclusoes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES users(id),
    tarefa_id INTEGER REFERENCES tarefas(id),
    post_id INTEGER REFERENCES posts(id),
    status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'concluida', 'verificada')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de atividades/histórico
CREATE TABLE atividades (
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
('seguir', 'Seguir a conta do post');

-- Inserir superadmin padrão (senha: admin123)
INSERT INTO users (nome, email, whatsapp, senha, tipo, status) 
VALUES ('Dona Central', 'admin@centraldivas.com', '5511999999999', '$2a$10$rQEY7zNhPMTJ8YqwC5VwXu2YqX5vN5m5F5vN5m5F5vN5m5F5vN5m5F', 'superadmin', 'ativa');
