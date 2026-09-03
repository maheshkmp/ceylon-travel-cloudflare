# How to run this project

## One command to run everything

```bash
bun dev
```

This single command starts **both** the API and the web app at the same time using Turborepo.

```
@repo/api  │ 🚀 API    → http://localhost:3001
@repo/api  │ 📖 Docs   → http://localhost:3001/docs
@repo/web  │ ▲  Web    → http://localhost:3000
```

You do NOT need to open two terminals. You do NOT need to cd into `apps/api` or `apps/web`.
Everything is managed from the root folder.

---

## Full first-time setup

```bash
# 1. Install dependencies (from root — installs all workspaces)
bun install

# 2. Set up environment files
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
cp packages/db/.env.example packages/db/.env

# 3. Generate a secure secret and add it to apps/api/.env
echo "BETTER_AUTH_SECRET=$(openssl rand -base64 48)"
# Copy the output and paste into apps/api/.env as BETTER_AUTH_SECRET=...

# 4. Start PostgreSQL + Redis + MailHog (Docker required)
bun docker:up:dev

# 5. Create database tables
bun db:push

# 6. Seed with sample users and data
bun db:seed

# 7. Start everything
bun dev
```

---

## Or run the one-liner setup

```bash
bun setup   # installs + starts docker + db:push + db:seed
bun dev     # starts both apps
```

---

## Running apps individually (optional)

If you only want one app:

```bash
bun dev:api   # API only  → http://localhost:3001
bun dev:web   # Web only  → http://localhost:3000
```

---

## Test accounts (after seed)

| Email | Password | Role |
|---|---|---|
| superadmin@example.com | Admin1234! | super_admin |
| admin@example.com | Admin1234! | admin |
| user1@example.com | Admin1234! | user |

---

## Key URLs

| URL | What |
|---|---|
| http://localhost:3000 | Web app |
| http://localhost:3001/docs | Scalar API docs (interactive) |
| http://localhost:3001/api/auth | Better Auth endpoints |
| http://localhost:3001/health | API health check |
| http://localhost:8025 | MailHog — catch all dev emails |

---

## Project structure

```
saas-boilerplate/          ← Run all commands from here
├── apps/
│   ├── api/               ← Bun + Hono backend (port 3001)
│   └── web/               ← Next.js 15 frontend (port 3000)
├── packages/
│   ├── db/                ← Database schema + migrations
│   ├── validators/        ← Shared Zod schemas
│   ├── types/             ← Shared TypeScript types
│   └── utils/             ← Shared utility functions
├── scripts/
│   └── generate.ts        ← CLI: bun generate resource <name>
├── package.json           ← Root — all commands go here
├── turbo.json             ← Turborepo pipeline
└── docker-compose.yml     ← PostgreSQL + Redis + MailHog
```

## Why you don't cd into apps/

This is a **Bun monorepo** using Turborepo. The root `package.json` has scripts
that use `turbo run` to orchestrate all apps and packages together:

- `bun dev` → Turborepo starts `api` and `web` in parallel
- `bun build` → Turborepo builds packages first, then apps in dependency order
- `bun test` → runs tests in all packages

Shared packages (`@repo/validators`, `@repo/db`, etc.) are automatically
available to both apps as local workspace dependencies — no publishing needed.
