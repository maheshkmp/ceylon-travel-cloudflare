# SaaS Boilerplate

Production-grade full-stack SaaS starter — **Bun + Hono + Better Auth + Next.js 15 + Drizzle ORM**.

---

## Stack

| Layer | Technology |
|---|---|
| **Monorepo** | Turborepo + Bun workspaces |
| **Frontend** | Next.js 15 (App Router), React 19, Tailwind CSS |
| **Backend** | Bun + Hono |
| **Auth** | **Better Auth** (sessions, email/password, email verification, password reset, RBAC) |
| **Database** | PostgreSQL 16 + Drizzle ORM |
| **Cache** | Redis (ioredis) — optional but recommended |
| **API Docs** | **Scalar** (interactive docs at `/docs`) |
| **Validation** | Zod — single source of truth for API, forms, env |
| **Data fetching** | TanStack Query v5 |
| **Jobs** | BullMQ (email queue, cleanup crons) |
| **Email** | Nodemailer + MailHog (dev) |
| **Storage** | S3-compatible (Cloudflare R2) |
| **Observability** | Pino structured logs + Sentry |

---

## Monorepo Structure

```
saas-boilerplate/                ← Root (Turborepo)
├── apps/
│   ├── api/                     ← Bun + Hono backend  :3001
│   └── web/                     ← Next.js 15 frontend  :3000
├── packages/
│   ├── db/                      ← Drizzle schema + migrations + seed
│   ├── validators/              ← Zod schemas (shared everywhere)
│   ├── types/                   ← TypeScript interfaces
│   └── utils/                   ← Pure utility functions
├── scripts/
│   └── generate.ts              ← CLI scaffolder
├── turbo.json
├── package.json
└── docker-compose.yml
```

---

## Quick Start

### Prerequisites
- [Bun](https://bun.sh) ≥ 1.1
- [Docker](https://docker.com) + Docker Compose

### 1. Clone & install

```bash
git clone https://github.com/your-org/saas-boilerplate.git
cd saas-boilerplate
bun install
```

### 2. Set up environment variables

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
cp packages/db/.env.example packages/db/.env
```

Edit `apps/api/.env` — the required fields:

```bash
# Generate a strong secret (min 32 chars):
openssl rand -base64 48

BETTER_AUTH_SECRET=<generated-secret>
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/saasdb

### 3. Start infrastructure

```bash
bun docker:up:dev
# Starts: PostgreSQL :5432, Redis :6379, MailHog :1025 / :8025
```

### 4. Database setup

```bash
bun db:push    # Push schema to DB
bun db:seed    # Create test users + sample data
```

### 5. Run both apps

```bash
bun dev
```

This runs **both** apps in parallel via Turborepo:

```
@repo/api  │ 🚀 API started  → http://localhost:3001
@repo/api  │ 📖 API docs     → http://localhost:3001/docs
@repo/api  │ 🔐 Better Auth  → http://localhost:3001/api/auth
@repo/web  │ ▲ Next.js       → http://localhost:3000
```

To run apps individually:

```bash
bun dev:api    # API only
bun dev:web    # Web only
```

---

## Running the Project

| Command | Description |
|---|---|
| `bun dev` | Run **both** API + Web in parallel |
| `bun dev:api` | Run API only (port 3001) |
| `bun dev:web` | Run Web only (port 3000) |
| `bun build` | Build all apps |
| `bun build:api` | Build API only |
| `bun build:web` | Build Web only |
| `bun test` | Run all tests |
| `bun test:api` | Run API tests only |
| `bun test:web` | Run Web tests only |
| `bun typecheck` | TypeScript check all packages |
| `bun lint` | ESLint all packages |

### Database commands

| Command | Description |
|---|---|
| `bun db:push` | Sync schema to DB (dev, no migration files) |
| `bun db:migrate` | Run migration files (production) |
| `bun db:generate` | Generate migration files |
| `bun db:studio` | Open Drizzle Studio GUI |
| `bun db:seed` | Seed with test data |

### Infrastructure commands

| Command | Description |
|---|---|
| `bun docker:up` | Start PostgreSQL + Redis |
| `bun docker:up:dev` | Start PostgreSQL + Redis + MailHog |
| `bun docker:down` | Stop all containers |
| `bun docker:logs` | Stream container logs |
| `bun setup` | Full setup: install + docker + db push + seed |

---

## Authentication (Better Auth)

Better Auth handles all auth flows. No custom JWT logic.

### How it works

```
Browser                    API (Better Auth)           DB
  │                              │                      │
  │  POST /api/auth/sign-in      │                      │
  │─────────────────────────────>│                      │
  │                              │  verify password     │
  │                              │─────────────────────>│
  │  Set-Cookie: session=...     │                      │
  │<─────────────────────────────│                      │
  │                              │                      │
  │  GET /api/v1/users/me        │                      │
  │  Cookie: session=...         │                      │
  │─────────────────────────────>│ validate session     │
  │                              │─────────────────────>│
  │  { data: { user } }          │                      │
  │<─────────────────────────────│                      │
```

Sessions are stored in the `session` table. Cookies are `httpOnly` and `secure` in production.

### Auth endpoints (auto-generated by Better Auth)

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/auth/sign-up/email` | Register with email + password |
| `POST` | `/api/auth/sign-in/email` | Login |
| `POST` | `/api/auth/sign-out` | Logout |
| `GET`  | `/api/auth/session` | Get current session |
| `POST` | `/api/auth/forget-password` | Send reset email |
| `POST` | `/api/auth/reset-password` | Reset password with token |
| `POST` | `/api/auth/send-verification-email` | Resend verification |
| `GET`  | `/api/auth/verify-email` | Confirm email address |

### RBAC

Three roles: `user` → `admin` → `super_admin`

```typescript
// Protect any API route:
usersRouter.use("*", requireAuth());              // any logged-in user
adminRouter.use("*", requireRole("admin"));       // admin+
adminRouter.use("*", requireRole("super_admin")); // super_admin only
```

### Frontend usage

```typescript
import { useAuth } from "@/hooks/use-auth";

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
}

// Or use Better Auth's hook directly:
import { useSession } from "@/lib/auth-client";

function MyComponent() {
  const { data: session, isPending } = useSession();
}
```

---

## API Documentation (Scalar)

Interactive API docs available at:

```
http://localhost:3001/docs
```

Features:
- Try any endpoint directly in the browser
- Auto-generated from Better Auth's OpenAPI plugin
- Bearer token authentication support
- Dark mode, modern layout
- Multiple language examples (fetch, curl, Python, etc.)

OpenAPI JSON spec: `http://localhost:3001/api/openapi.json`

---

## Seed Credentials

After `bun db:seed`:

| Email | Password | Role |
|---|---|---|
| `superadmin@example.com` | `Admin1234!` | super_admin |
| `admin@example.com` | `Admin1234!` | admin |
| `user1@example.com` | `Admin1234!` | user |
| `user2-5@example.com` | `Admin1234!` | user |

---

## Add a new resource in seconds

```bash
bun generate resource invoice
```

Scaffolds 6 files automatically:
- `packages/validators/src/invoices.ts` — Zod schema
- `packages/db/src/schema/invoices.ts` — Drizzle table
- `apps/api/src/services/invoices.service.ts` — business logic
- `apps/api/src/routes/invoices.ts` — REST endpoints
- `apps/web/src/hooks/use-invoices.ts` — TanStack Query hooks
- `apps/web/src/app/(dashboard)/invoices/page.tsx` — full CRUD page

Then follow the printed instructions to mount the route and add to sidebar.

---

## Deployment

### API → Fly.io

```bash
cd apps/api
flyctl launch
flyctl secrets set \
  BETTER_AUTH_SECRET=$(openssl rand -base64 48) \
  DATABASE_URL=postgresql://... \
  BETTER_AUTH_URL=https://api.yourdomain.com
flyctl deploy
```

### Web → Vercel

```bash
cd apps/web
vercel --prod
```

Set env vars in Vercel dashboard:
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_URL=https://app.yourdomain.com
BETTER_AUTH_URL=https://api.yourdomain.com
```

---

## MailHog (dev email)

All emails in development are caught by MailHog:

```
http://localhost:8025
```

Start MailHog:
```bash
bun docker:up:dev   # includes --profile dev
```

---

## Architecture

```
Request → Hono Route (validate) → Service (logic) → DB/Cache → Response
                 ↑
          Better Auth middleware
         (session validation, RBAC)
```

- **Routes** — thin, just validate + delegate to service
- **Services** — all business logic, DB queries, cache management
- **Better Auth** — handles all session/auth logic
- **Zod validators** — single source of truth: API validation, forms, TypeScript types, env validation
