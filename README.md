# Ceylon Travels — Project & Architecture Overview

> Last updated: September 2026

---

## 🏗️ Architecture

This is a **monolithic Next.js 15 application** running on the **Bun** runtime. Everything — frontend public pages, multi-tenant organization dashboard, protected admin panel, backend API routes, authentication, and database access — lives in a single unified codebase.

The path aliases (`@repo/validators`, `@/components`, etc.) resolve locally within `src/`. There is **no separate backend server**.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Runtime** | Bun |
| **Language** | TypeScript 5.7 |
| **Database** | PostgreSQL (Neon serverless) |
| **ORM** | Drizzle ORM + drizzle-kit |
| **Auth** | better-auth (Email/Password, Google OAuth, Admin & Organization plugins) |
| **Styling** | Tailwind CSS v3, Framer Motion |
| **UI Components** | Radix UI Primitives, Lucide React |
| **Rich Text** | TipTap |
| **Server State** | TanStack Query v5 |
| **Client State** | Zustand v5 |
| **Forms** | React Hook Form + Zod |
| **Media / Storage** | Cloudflare R2 / S3 API endpoint (`/api/upload`) |

---

## 📁 Directory Structure

```
ceylon-travels/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── page.tsx                # Homepage (/)
│   │   ├── layout.tsx              # Root layout — loads site settings & providers
│   │   ├── globals.css             # Global Tailwind styles
│   │   ├── about/                  # /about page
│   │   ├── destinations/           # /destinations page & destination details
│   │   ├── itinerary/              # /itinerary tour package listings & detail pages
│   │   ├── journal/                # /journal page (blog listing)
│   │   ├── blog/                   # /blog/[slug] individual articles
│   │   ├── wishlist/               # Saved itineraries & destinations
│   │   ├── faq/                    # Frequently asked questions
│   │   ├── privacy/                # Privacy policy page
│   │   ├── terms/                  # Terms of service page
│   │   ├── cookie-policy/          # Cookie policy page
│   │   ├── refund-policy/          # Refund policy page
│   │   ├── invitations/            # Team organization invitation acceptance
│   │   ├── auth/                   # Login, register, forgot-password, reset-password
│   │   ├── (dashboard)/            # Multi-tenant user & organization portal
│   │   │   ├── dashboard/          # Personal user overview
│   │   │   ├── organizations/      # Organization workspace management
│   │   │   ├── users/              # User account settings
│   │   │   └── settings/           # User preferences
│   │   ├── admin/                  # Protected administrative panel
│   │   │   ├── page.tsx            # Admin analytics & system dashboard
│   │   │   ├── inquiries/          # Quote request pipeline & management
│   │   │   ├── itineraries/        # Tour package CRUD & day builder
│   │   │   ├── posts/              # Article editor (TipTap rich text)
│   │   │   ├── destinations/       # Destination management
│   │   │   ├── site-settings/      # Dynamic site configuration UI
│   │   │   ├── sessions/           # Active auth session manager
│   │   │   └── audit-logs/         # Security & action audit logs
│   │   └── api/                    # Serverless Next.js API endpoints
│   │       ├── auth/[...all]/      # better-auth handler
│   │       ├── admin/              # Admin CRUD (destinations, inquiries, itineraries, posts, sessions, settings, stats, users, audit-logs)
│   │       ├── inquiries/          # Public quote request submission
│   │       └── upload/             # Image & asset upload endpoint
│   ├── components/
│   │   ├── home/                   # Hero, NavBar, Footer, InquiryWizard, Testimonials, etc.
│   │   ├── ui/                     # Shared design system (Radix-based UI elements)
│   │   ├── layout/                 # Main & Admin layouts
│   │   ├── posts/                  # TipTap blog editor & components
│   │   └── providers.tsx           # React Query, Auth & Settings Context providers
│   ├── db/
│   │   ├── client.ts               # Singleton Drizzle connection
│   │   ├── schema/index.ts         # PostgreSQL database table schemas & relations
│   │   ├── seed.ts                 # Seeding script
│   │   └── migrations/             # Drizzle migration files
│   ├── lib/
│   │   ├── auth.ts                 # Server auth configuration (better-auth)
│   │   ├── auth-client.ts          # Client auth SDK
│   │   ├── api-client.ts           # Fetch API client wrapper
│   │   └── validators/             # Zod validation schemas
│   ├── hooks/                      # React hooks
│   ├── store/                      # Zustand state stores
│   └── middleware.ts               # Affiliate referral tracking & Request ID injection
├── drizzle.config.ts               # Drizzle ORM configuration
├── wrangler.toml                   # Cloudflare configuration
├── next.config.mjs                 # Next.js configuration
└── package.json
```

---

## 🗄️ Database Schema

All database models are defined using Drizzle ORM in `src/db/schema/index.ts`:

| Table | Purpose |
|---|---|
| `user` | User accounts (email, password, role: `user` \| `admin`, ban status) |
| `session` | Active authentication sessions |
| `account` | OAuth provider credentials (Google, etc.) |
| `verification` | Email verification & password reset tokens |
| `organizations` | Team / B2B organization workspaces |
| `org_members` | Organization membership roles (`owner`, `admin`, `member`) |
| `invitations` | Pending organization invitations |
| `audit_logs` | Security and administrative audit log trail |
| `inquiries` | Travel quote requests submitted via Inquiry Wizard |
| `itineraries` | Tour packages with detailed day-by-day JSON itineraries |
| `posts` | Blog articles with rich text content |
| `destinations` | Sri Lanka travel destinations |
| `travel_categories` | Categorized travel experiences (e.g. Wildlife, Culture, Beaches) |
| `testimonials` | Customer reviews and ratings |
| `gallery_images` | Curated gallery image showcase |
| `site_settings` | Dynamic key-value store for site-wide settings |

---

## 🔐 Authentication & Roles

- **Framework**: `better-auth` v1.2 with Email/Password & Google OAuth.
- **Plugins**: Admin plugin (role management) and Organization plugin (multi-tenant workspaces).
- **Roles**:
  - `user`: Standard customer access, personal wishlist, and organization member capabilities.
  - `admin`: Full administrative control over inquiries, itineraries, site settings, blog posts, sessions, and audit logs.

---

## 🌟 Key & New Features

### 🚀 Public Experience & Booking
1. **Interactive 5-Step Inquiry Wizard**: Multi-step quote request modal collecting travel style, budget, group size, dates, and custom preferences.
2. **Dynamic Wishlist**: Interactive client-side wishlist allowing travelers to save favorite itineraries and destinations.
3. **Comprehensive Information Center**: Dedicated routes for FAQ, Privacy Policy, Terms of Service, Cookie Policy, and Refund Policy.
4. **Rich Content Showcase**: High-performance destination grids, categorized travel styles, customer reviews, and media gallery.

### 🏢 Multi-Tenant User & Organization Portal (`/(dashboard)`)
1. **Organization Workspaces**: Create and manage travel organizations, teams, or agent groups.
2. **Team Member Management**: Invite collaborators with granular role permissions (`owner`, `admin`, `member`).
3. **Invitation Flow**: Dedicated invitation handling system (`/invitations`) for seamless team onboarding.
4. **User Profile Settings**: Manage account credentials, personal details, and user preferences.

### ⚡ Admin & CMS Controls (`/admin`)
1. **Analytics Dashboard**: Real-time overview of inquiries, active sessions, destination stats, and system activity.
2. **Itinerary & Tour Builder**: Full day-by-day tour package manager supporting custom activity tags, inclusions, exclusions, and FAQs.
3. **TipTap Blog Publisher**: Rich text article creation with image embedding, tags, and reading time estimation.
4. **Media Upload Manager**: Integrated asset upload endpoint (`/api/upload`) supporting Cloudflare R2 / S3 storage.
5. **Session & Security Manager**: View active user sessions, invalidate compromised tokens, and inspect system audit logs.
6. **Dynamic Site Settings**: Update brand details, SEO metadata, contact info, and analytics keys dynamically from the UI.

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# ─── Database ─────────────────────────────────────────────────────────────────
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
DATABASE_POOL_MAX=10

# ─── Auth ─────────────────────────────────────────────────────────────────────
BETTER_AUTH_SECRET=your-32-char-secret-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000

# ─── Storage (Cloudflare R2 / S3) ─────────────────────────────────────────────
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET_NAME=your-bucket
S3_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
```

---

## 🚀 Local Development

```bash
# 1. Install dependencies
bun install

# 2. Copy environment file
cp .env.example .env

# 3. Synchronize database schema
bun db:push

# 4. Seed sample data (optional)
bun db:seed

# 5. Launch development server
bun run dev
# App will run at http://localhost:3000
```

---

## 🔑 Key Scripts

```bash
bun run dev          # Start development server
bun run build        # Production build
bun run start        # Start production server
bun run typecheck    # TypeScript verification
bun run lint         # ESLint checks
bun db:push          # Push schema changes directly to DB
bun db:migrate       # Execute pending database migrations
bun db:generate      # Generate Drizzle migrations
bun db:studio        # Launch Drizzle Studio (visual database UI)
bun db:seed          # Seed database with initial datasets
```
