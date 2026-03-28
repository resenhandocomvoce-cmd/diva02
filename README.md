# 👑 Central Divas 2.0 👑

Plataforma SaaS para grupos de engajamento do Instagram.

## 🚀 Tecnologias

- **Frontend**: Next.js 14 + TailwindCSS + TypeScript
- **Backend**: Node.js + Express
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL 14+

## 🔧 Instalação

### 1. Banco de Dados

```bash
# Criar banco de dados
psql -U postgres -c "CREATE DATABASE central_divas;"

# Executar schema
psql -U postgres -d central_divas -f database/schema.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edite o arquivo .env com suas configurações

npm install
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🔐 Usuário Padrão

O sistema cria automaticamente um Super Admin:

- **Email**: admin@centraldivas.com
- **Senha**: admin123

## 📁 Estrutura

```
├── backend/
│   ├── src/
│   │   ├── config/     # Configurações
│   │   ├── controllers/# Lógica de negócio
│   │   ├── middleware/ # Autenticação
│   │   ├── models/    # Modelos (futuro)
│   │   ├── routes/    # Rotas da API
│   │   └── index.js   # Servidor
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/       # Páginas Next.js
│   │   ├── components/# Componentes
│   │   ├── contexts/  # Contextos React
│   │   ├── lib/       # Utilitários
│   │   └── types/     # Tipos TypeScript
│   └── package.json
│
└── database/
    └── schema.sql     # Schema do banco
```

## 🔗 API Endpoints

### Auth
- `POST /api/auth/register` - Cadastro
- `POST /api/auth/login` - Login

### Users
- `GET /api/users` - Listar usuários
- `GET /api/users/:id` - Ver usuário
- `PUT /api/users/:id` - Atualizar usuário
- `GET /api/users/stats` - Estatísticas

### Posts
- `GET /api/posts` - Listar posts
- `GET /api/posts/today` - Posts de hoje
- `POST /api/posts` - Criar post (admin)
- `DELETE /api/posts/:id` - Excluir post

### Tarefas
- `GET /api/tarefas` - Listar tarefas
- `POST /api/tarefas` - Criar tarefa (admin)

### Conclusões
- `POST /api/conclusoes/complete` - Completar tarefa
- `GET /api/conclusoes/progress` - Ver progresso

## 👥 Tipos de Usuários

| Tipo | Descrição |
|------|-----------|
| superadmin | Acesso total ao sistema |
| admin | Gerencia participantes e posts |
| user | Participante do grupo |

## 🎨 Design

- Cores: Rosa, Nude, Branco
- Interface estilo SaaS moderna
- Layout responsivo

## 📝 Licença

MIT
