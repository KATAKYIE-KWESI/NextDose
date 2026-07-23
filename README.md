# NextDose — v1 MVP

Cycle/symptom tracking + screening reminders + concierge specialist booking,
scoped to the "v1" tier of the plan: prove women will pay for trusted,
private access to a specialist — not a diagnostic tool.

Stack: **React (Vite) + React Router** frontend, **Node.js serverless
functions** (Vercel's `/api` folder) for the backend. One repo, one Vercel
project, no separate backend host needed.

## What's included

- Email/password auth (JWT)
- Cycle + symptom logging with history
- Screening reminders (Pap smear, breast exam) — framed as awareness, not
  diagnosis, per the "cut the diagnostic-sounding claim" note
- Specialist directory (seeded with 2 demo profiles)
- Consult **request** flow — concierge model: the user submits preferred
  times + contact info, a human confirms and takes payment manually. No
  payment/video integration yet, on purpose — that's v2, after you've
  proven people will pay.

## Local development

```bash
npm install
npm i -g vercel   # if you don't have it
vercel dev
```

`vercel dev` runs both the Vite frontend and the `/api` serverless
functions together, which is what you want locally — running `vite` alone
will not execute the API routes.

## Deploying to Vercel

```bash
vercel        # first deploy, follow prompts
vercel --prod # promote to production
```

Or connect the GitHub repo in the Vercel dashboard for auto-deploys on
push. Vercel auto-detects `vercel.json`, builds the Vite app, and deploys
everything in `/api` as serverless functions.

### Required environment variable

Set this in the Vercel dashboard (Project → Settings → Environment
Variables) before going live:

- `JWT_SECRET` — any long random string. Without it the API falls back to
  an insecure dev default.

## ⚠️ Before you onboard real users: add a real database

This MVP stores data in memory (`api/_lib/db.js`) so you can run it and
demo it immediately with zero setup. **Serverless functions on Vercel are
stateless** — that in-memory store resets on cold starts and isn't shared
across function instances. It's fine for local dev and a click-through
demo; it is *not* fine for your 30–50 concierge testers.

Fastest real options:
1. **Vercel Postgres** (native integration, easiest to wire up from the
   Vercel dashboard)
2. **Supabase** or **Neon** (free-tier Postgres, works great with
   serverless)

Because every route only talks to the `db` object exported from
`api/_lib/db.js`, you only need to rewrite that one file — swap the
`Map()`-based methods for SQL queries using the same method names
(`getUserByEmail`, `createUser`, `addCycleLog`, etc.) and every route
keeps working unchanged. A minimal schema:

```sql
create table users (
  id text primary key,
  email text unique not null,
  password_hash text not null,
  name text not null,
  birth_year int,
  last_pap date,
  last_breast_exam date,
  created_at timestamptz default now()
);

create table cycle_logs (
  id text primary key,
  user_id text references users(id),
  date date not null,
  type text not null,
  symptoms jsonb,
  flow text,
  notes text,
  created_at timestamptz default now()
);

create table specialists (
  id text primary key,
  name text, specialty text, languages jsonb, city text, bio text
);

create table bookings (
  id text primary key,
  user_id text references users(id),
  specialist_id text references specialists(id),
  preferred_times text,
  reason text,
  contact text,
  status text default 'requested',
  created_at timestamptz default now()
);
```

## Next steps after v0 (per the plan)

1. **Concierge test first, even ahead of this app**: manually match your
   first 30–50 users to a specialist and charge for the consult before
   you lean on this code at all. The question to answer is willingness to
   pay, not whether the app works.
2. Once that's validated, use this v1 app to remove the manual matching
   step — but keep booking **confirmation** manual (a human follows up on
   `contact`) until volume justifies automating it.
3. Add Stripe to `api/bookings.js` to charge at request time instead of
   after manual confirmation.
4. Track **paid-consult conversion and repeat rate** as your core metric,
   not signups or downloads.
5. Defer symptom-pattern detection (v2) until you have real usage data
   and have sorted out data governance — it's expensive and unnecessary
   to prove the wedge.

## Project structure

```
api/
  _lib/db.js          shared data layer (swap for real DB before launch)
  _lib/auth.js         JWT + password hashing helpers
  auth/signup.js, login.js, me.js
  cycle/index.js        GET list / POST create
  cycle/[id].js          DELETE
  screening.js            GET reminders / POST log a completed screening
  specialists.js           GET directory
  bookings.js                GET my bookings / POST request a consult
src/
  pages/                Login, Signup, Dashboard, CycleTracker, Screening,
                         Specialists, Bookings
  api/client.js          fetch wrapper + JWT storage
  AuthContext.jsx         auth state/provider
```
