# Baolog CMS Prototype

This is a minimal NestJS + Prisma prototype for a headless CMS you can run locally.

Key points
- Uses SQLite for local development (no external DB required).
- Provides simple REST endpoints: `GET /api/posts`, `GET /api/posts/:slug`, `POST /api/posts`.
- Includes a `prisma/schema.prisma` model for `Post`.

Quick start

1. Install dependencies

```bash
cd cms
npm install
```

2. Generate Prisma client and migrate (creates `dev.db`)

```bash
npm run prisma:generate
npm run prisma:migrate
```

3. Start dev server

```bash
npm run dev
```

The API will be available at `http://localhost:4000/api/posts`.

Admin UI

This prototype does not include a full admin UI by default. Recommended quick options:
- AdminJS (npm: `adminjs`, `@adminjs/nestjs`) — integrates with Nest and Prisma.
- Build a lightweight Next.js admin under `/admin` using the same Prisma API.

Deployment

This example is primarily for local prototyping. For production hosting consider Render, Fly, or a small VPS. If you want the CMS to be serverless alongside Vercel, you'd instead convert it to serverless functions or use a hosted CMS (Sanity, Supabase).
