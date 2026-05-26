# Centro de Educación Inicial Fantasía — Website & Admin Panel

A full-stack web application for **Centro de Educación Inicial Fantasía**, a kindergarten located in Parque del Plata, Canelones, Uruguay. Built with Next.js 14 App Router.

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS v3 + shadcn/ui components
- **Database**: Prisma ORM + SQLite (dev) / PostgreSQL (production)
- **Auth**: NextAuth.js v4 (credentials — email + password)
- **Forms**: react-hook-form + zod
- **Charts**: recharts
- **Gallery**: yet-another-react-lightbox

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.local` and fill in the values (already created with defaults):

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-in-production-min-32-chars"
ADMIN_EMAIL="admin@fantasiakinder.edu.uy"
ADMIN_PASSWORD="Fantasia2024!"
```

> **Production**: Generate a strong `NEXTAUTH_SECRET` with `openssl rand -base64 32`.

### 3. Push the database schema

```bash
DATABASE_URL="file:./dev.db" npx prisma db push
```

Or with npm scripts (reads from `.env.local`):

```bash
npm run db:push
```

### 4. Seed demo data

```bash
DATABASE_URL="file:./dev.db" ADMIN_EMAIL="admin@fantasiakinder.edu.uy" ADMIN_PASSWORD="Fantasia2024!" npx tsx prisma/seed.ts
```

This creates:
- 1 admin user
- 15 sample children
- ~975 attendance records (3 months)
- 10 gallery photos (from picsum.photos)
- 3 news posts
- 5 events
- 4 staff members
- 3 contact messages
- Institution settings

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Admin Panel

Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login):

| Field | Value |
|-------|-------|
| Email | `admin@fantasiakinder.edu.uy` |
| Password | `Fantasia2024!` |

### Admin sections:
- `/admin/dashboard` — Stats overview with recharts
- `/admin/ninos` — Children CRUD + CSV export
- `/admin/asistencia` — Daily attendance marking
- `/admin/galeria` — Photo upload & management
- `/admin/noticias` — News/announcements editor
- `/admin/eventos` — Events calendar management
- `/admin/equipo` — Staff cards management
- `/admin/mensajes` — Contact form inbox
- `/admin/configuracion` — Site settings + password change

---

## Switching to PostgreSQL (Production)

1. In `prisma/schema.prisma`, change:
   ```prisma
   datasource db {
     provider = "postgresql"   // was "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

2. Update `DATABASE_URL` in your production environment:
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"
   ```

3. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | SQLite path (`file:./dev.db`) or PostgreSQL URL |
| `NEXTAUTH_URL` | ✅ | Full URL of your site (e.g. `https://yourdomain.com`) |
| `NEXTAUTH_SECRET` | ✅ | Random secret ≥ 32 chars for JWT signing |
| `ADMIN_EMAIL` | Seed only | Email for the admin user created by seed script |
| `ADMIN_PASSWORD` | Seed only | Password for the admin user created by seed script |
| `SMTP_HOST` | Optional | SMTP server for email sending |
| `SMTP_PORT` | Optional | SMTP port (usually 587) |
| `SMTP_USER` | Optional | SMTP username |
| `SMTP_PASS` | Optional | SMTP app password |

---

## Creating the First Admin User (without seed)

If you don't want to run the full seed, create the admin user manually:

```ts
// run once: node -e "require('bcryptjs').hash('YourPassword', 12).then(console.log)"
// then insert into the User table via prisma studio or sql
```

Or just run the seed — it's idempotent (safe to run multiple times).

---

## Project Structure

```
/app
  /(public)            — Public site (home, gallery, nosotros, contacto)
  /admin               — Admin panel (auth-guarded by middleware.ts)
  /api/admin           — REST API routes for admin operations
  /api/auth            — NextAuth.js handler
  /api/contact         — Public contact form submission
/components
  /public              — Navbar, Footer, Hero, Gallery, WhatsApp button, etc.
  /admin               — Sidebar, Dashboard charts, all admin CRUD clients
  /ui                  — shadcn/ui base components
/lib
  db.ts                — Prisma client singleton
  auth.ts              — NextAuth configuration
  utils.ts             — Helpers (cn, formatDate, exportToCSV, etc.)
/prisma
  schema.prisma        — Database schema
  seed.ts              — Demo data seed script
/public
  /uploads             — User-uploaded images (local dev)
  robots.txt
/types
  next-auth.d.ts       — Session type augmentation
  css.d.ts             — CSS module declarations
```

---

## Useful Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run db:push      # Sync schema to DB (dev)
npm run db:studio    # Open Prisma Studio (DB GUI)
npm run db:seed      # Run seed script
```
