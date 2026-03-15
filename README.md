# Portal Intranet

Sistema de intranet para funcionários com diretório de colaboradores, comunicados e links úteis. Construído com React + TypeScript (frontend) e Node.js + Express + SQLite (backend), containerizável via Docker.

---

## Funcionalidades

- **Página inicial pública**: comunicados, links úteis e destaque de aniversariantes do mês corrente
- **Diretório de colaboradores**: tabela com busca em tempo real por nome
- **Painel administrativo** (acesso protegido por JWT):
  - CRUD de colaboradores (nome, e-mail, ramal, setor, data de aniversário)
  - CRUD de comunicados
  - CRUD de links úteis

---

## Pré-requisitos

- **Node.js** ≥ 18 e **npm** ≥ 9
- (Opcional para deploy) **Docker** e **Docker Compose**

---

## Executando localmente (desenvolvimento)

### 1. Clone o repositório

```bash
git clone https://github.com/Monkius-Maximus/intrarenew.git
cd intrarenew
```

### 2. Configure o backend

```bash
cd backend

# Copie o arquivo de variáveis de ambiente e ajuste os valores
cp .env.example .env
# Edite .env se quiser mudar JWT_SECRET ou PORT

# Instale as dependências
npm install

# Crie o banco de dados e execute as migrações
npx prisma migrate dev --name init

# Popule com dados de exemplo (cria admin padrão: admin / admin123)
npm run seed

# Inicie o servidor em modo de desenvolvimento (hot-reload)
npm run dev
```

O backend ficará disponível em **http://localhost:3000**.

### 3. Configure o frontend

Abra um **novo terminal** na raiz do projeto:

```bash
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O frontend ficará disponível em **http://localhost:5173** e todas as chamadas para `/api` são automaticamente enviadas ao backend via proxy do Vite.

### 4. Acesse o sistema

| URL | Descrição |
|-----|-----------|
| http://localhost:5173 | Página pública (comunicados, links, aniversariantes) |
| http://localhost:5173/directory | Diretório de colaboradores |
| http://localhost:5173/admin/login | Login do painel administrativo |
| http://localhost:5173/admin | Painel admin (requer login) |

**Credenciais padrão do admin:** `admin` / `admin123`

> ⚠️ Troque a senha padrão em produção. O admin pode ser criado/alterado diretamente no banco ou via script.

---

## Deploy com Docker

```bash
# Na raiz do projeto
docker-compose up --build
```

A aplicação ficará disponível em **http://localhost** (porta 80).  
O arquivo SQLite é persistido no volume `db_data`.

---

## Estrutura do projeto

```
intrarenew/
├── backend/                   # API Node.js + Express + Prisma
│   ├── prisma/
│   │   ├── schema.prisma      # Modelos do banco de dados
│   │   └── migrations/        # Migrações SQL geradas pelo Prisma
│   ├── src/
│   │   ├── server.ts          # Entrada da aplicação
│   │   ├── middleware/auth.ts  # Middleware JWT
│   │   ├── routes/            # Rotas da API
│   │   └── seed.ts            # Script de dados iniciais
│   ├── .env.example           # Variáveis de ambiente necessárias
│   └── package.json
├── frontend/                  # React + TypeScript + Vite + MUI
│   ├── src/
│   │   ├── App.tsx            # Definição de rotas
│   │   ├── api.ts             # Cliente Axios
│   │   ├── types.ts           # Tipos TypeScript
│   │   ├── components/        # Layouts e PrivateRoute
│   │   └── pages/             # Páginas públicas e admin
│   └── package.json
├── Dockerfile                 # Build multi-estágio (frontend + backend + Nginx)
├── docker-compose.yml         # Orquestração Docker com volume persistente
├── nginx.conf                 # Proxy reverso + fallback SPA
└── migrate-data.js            # Script de importação de dados em massa
```

---

## Rotas da API

### Públicas (sem autenticação)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/employees` | Lista colaboradores (aceita `?search=nome`) |
| GET | `/api/employees/birthdays` | Colaboradores aniversariantes do mês atual |
| GET | `/api/announcements` | Lista comunicados (mais recentes primeiro) |
| GET | `/api/links` | Lista links úteis |

### Administrativas (requer `Authorization: Bearer <token>`)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/login` | Autenticação — retorna JWT |
| POST/PUT/DELETE | `/api/employees/:id` | CRUD de colaboradores |
| POST/PUT/DELETE | `/api/announcements/:id` | CRUD de comunicados |
| POST/PUT/DELETE | `/api/links/:id` | CRUD de links |

---

## Migração de dados existentes

Use o script `migrate-data.js` para importar dados de um arquivo JSON:

```bash
# Com o backend rodando:
node migrate-data.js --input meus-dados.json
```

Formato esperado do arquivo JSON:

```json
{
  "employees": [
    { "name": "João Silva", "email": "joao@empresa.com", "extension": "1001", "sector": "TI", "birthday": "03-15" }
  ],
  "announcements": [
    { "title": "Aviso", "message": "Texto do comunicado" }
  ],
  "links": [
    { "name": "Portal RH", "url": "http://rh.intra" }
  ]
}
```

> O campo `birthday` usa o formato `MM-DD` (mês-dia, sem o ano).

---

## Variáveis de ambiente (backend)

Copie `backend/.env.example` para `backend/.env` e ajuste:

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `DATABASE_URL` | Caminho do banco SQLite | `file:./dev.db` |
| `JWT_SECRET` | Segredo para assinar tokens JWT | — (obrigatório) |
| `PORT` | Porta do servidor backend | `3000` |