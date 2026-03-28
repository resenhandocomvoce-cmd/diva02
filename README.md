# 👑 Central Divas 2.0 👑

Plataforma SaaS para grupos de engajamento do Instagram.

## 🚀 Tecnologias

- **Frontend**: Next.js 14 + TailwindCSS + TypeScript
- **Backend**: Node.js + Express
- **Banco de Dados**: PostgreSQL (Supabase)
- **Autenticação**: JWT

## 📋 Pré-requisitos

- Node.js 18+
- Conta no Supabase
- Conta na Vercel

## 🔧 Configuração

### 1. Supabase

Copie o código do arquivo `database/schema.sql` e execute no editor SQL do Supabase.

### 2. Backend

Edite o arquivo `backend/.env` com as credenciais do Supabase:

```env
PORT=3001
DB_HOST=seu-projeto.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=sua-senha
JWT_SECRET=sua-chave-secreta
```

### 3. Deploy

O projeto está pronto para deploy na Vercel!

## 🔐 Usuário Padrão

- **Email**: admin@centraldivas.com
- **Senha**: admin123

## 📁 Estrutura

```
├── backend/          # API Node.js + Express
├── frontend/         # Next.js 14
└── database/        # Schema SQL
```

## 👥 Tipos de Usuários

| Tipo | Descrição |
|------|-----------|
| superadmin | Acesso total |
| admin | Gerência |
| user | Participante |

## 🎨 Design

- Cores: Rosa, Nude, Branco
- Interface estilo SaaS moderna

## 📝 Licença

MIT
