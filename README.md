# Deskrawl Helper

Community toolkit for **Deskrawl: Idle ARPG**: build sharing, a theorycraft planner and local-first `game.log` analysis.

> Any unverified game content is explicitly marked as demo/placeholder data. The project does not present invented skills, items, talents, formulas or builds as real Deskrawl data.

## Stack

- Next.js App Router + React + strict TypeScript
- Tailwind CSS
- PostgreSQL (Neon recommended on Vercel)
- Prisma ORM
- Zod
- Vitest

## Local setup

```bash
npm install
cp .env.example .env
npx prisma generate
npm run dev
```

For database-backed features, set `DATABASE_URL`, then create and commit a migration:

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

## Commands

```bash
npm run dev
npm run typecheck
npm run lint
npm run test
npm run build
```

## Architecture

- `src/app` — pages and Route Handlers
- `src/components` — build, planner and log-analyzer UI
- `src/lib/deskrawl-log-parser` — browser-safe parsing
- `src/lib/calculator` — isolated calculation engine
- `src/lib/validators` — Zod validation
- `src/lib/db` — Prisma client
- `prisma/schema.prisma` — PostgreSQL schema
- `prisma/seed.ts` — clearly marked demo seed data

## MVP routes

- `/`
- `/builds`
- `/builds/[slug]`
- `/builds/new`
- `/planner`
- `/tools/log-analyzer`
- `GET/POST /api/builds`
- `GET/PATCH/DELETE /api/builds/[slug]`
- `POST /api/builds/[slug]/vote`
- `POST /api/builds/[slug]/comments`

The mutation endpoints intentionally return `501` until authentication and persistence are wired, rather than pretending writes succeeded.

## game.log safety

The analyzer reads a selected file directly in the browser, enforces a 5 MB UI limit and treats every line as untrusted text. It never evaluates log contents as code. Exact Deskrawl event parsing must be based on real log samples.

## Deploy on Vercel + Neon

1. Import `Mamaad/deskrawl-helper` into Vercel.
2. Add a Neon PostgreSQL integration/database from the Vercel Marketplace.
3. Expose `DATABASE_URL` to the project.
4. Create the first Prisma migration against the configured database and commit `prisma/migrations`.
5. Use `npx prisma migrate deploy` in the controlled deployment workflow.
6. Deploy; Vercel uses `npm run build`.

## Authentication

The schema already supports users, votes and comments. Discord OAuth is intentionally deferred until provider credentials exist. Auth.js can be added without changing the data model.

## Next steps

1. Add real Deskrawl `game.log` samples and document event formats.
2. Import verified skills, talents, items and runes with game-version provenance.
3. Wire authenticated mutations to Prisma.
4. Add Discord OAuth.
5. Replace demo lists with database queries, filters, votes and comments.
