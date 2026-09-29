# Deskrawl Helper

Unofficial community toolkit for **Deskrawl: Idle ARPG**.

The project is deliberately provenance-first: game-data facts, demo snapshots, measured observations and community theory are not silently mixed together.

## Current features

- Gaming-oriented Next.js interface rather than a generic SaaS landing page
- 10 UI locales: English, French, German, Spanish, Simplified Chinese, Japanese, Korean, Polish, Brazilian Portuguese and Russian
- Local-first `game.log` tracker: the selected file is parsed in the browser and is not uploaded by default
- Player-facing instructions for locating a `game.log` without pretending there is a verified universal path
- Versioned Deskrawl data layer with source URLs and snapshot dates
- Warrior demo talent tree imported from the indexed AFK Meta snapshot
- Launch-level sanity counts kept separately from the older demo dataset
- Community build archive, build editor scaffold and generic calculator sandbox
- PostgreSQL/Prisma schema for users, builds, skills, talents, equipment, runes, votes and comments

> Unverified game content is always marked as demo, generic, community or unknown. The project does not invent Deskrawl skills, items, formulas or log metrics.

## Data provenance

### AFK Meta

AFK Meta's published methodology states that its game references are built from data tables shipped with the game client, with decoded columns cross-checked against tooltips, screenshots and measured runs. Deskrawl Helper links to the original source and keeps the snapshot date attached to imported facts.

The publicly indexed Deskrawl Warrior talent snapshot used here is dated **2026-09-27** and represents the pre-launch/demo state. It must not be silently mixed with release class trees.

### Launch reference

A release-level reference indexed on **2026-09-29** reports four heroes, 56 abilities, 161 talents, 209 equipment pieces, 67 minions and 62 enemies. These totals are used as release sanity checks while exact rows await a directly inspectable/versioned export.

### Files

SteamDB's Cloud Save configuration confirms `Deskrawl/Data/save.json` under the Steam install directory. That is a save-file location; it is not treated as proof of a universal `game.log` path.

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

## Main routes

- `/` — terminal/home
- `/tracker` — local `game.log` analyzer + file-finding guide
- `/talents` — versioned Talent Lab
- `/sources` — methodology and provenance
- `/builds` and `/builds/[slug]` — community archive scaffold
- `/builds/new` — build editor scaffold
- `/planner` — theorycraft sandbox
- `/tools/log-analyzer` — legacy redirect to `/tracker`

## game.log safety

The tracker:
- reads a selected file locally in the browser;
- applies a 10 MB UI limit;
- treats every line as untrusted text;
- never evaluates log contents as code;
- keeps unknown lines visible;
- does not label inferred values as real DPS/drop statistics.

Exact Deskrawl event parsing should be expanded from real log samples.

## Deploy on Vercel + Neon

1. Import `Mamaad/deskrawl-helper` into Vercel.
2. Attach a Neon PostgreSQL database.
3. Expose `DATABASE_URL`.
4. Create and commit the initial Prisma migration.
5. Deploy from `main`.

## Next data work

1. Obtain a current release `game.log` sample and formalize its event grammar.
2. Import release class talent rows from a directly inspectable client-data export or equivalently verifiable source.
3. Import versioned ability/equipment/rune datasets.
4. Wire authenticated build publishing, voting, comments and Discord OAuth.
