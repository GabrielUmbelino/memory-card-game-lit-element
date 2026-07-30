# Neon Recall

Client-rendered Next.js memory card game. Two pages: presentation with rankings (`/`) and the
game (`/game`).

## Commands

```
npm run dev       # dev server on http://localhost:3000
npm run build     # static export to out/
npm run preview   # serve out/ locally
npm test          # unit tests (vitest)
npm run test:e2e  # integration tests (playwright)
npm run lint
```

`npm run test:e2e` runs against the dev server. Set `E2E_BASE_URL` to test a build or a
deployed URL instead, for example `E2E_BASE_URL=http://localhost:3000 npm run test:e2e`.

## Deploy

`output: "export"` in `next.config.ts` makes `npm run build` write a static site to `out/`.
Nothing runs server side.

Cloudflare Pages: build command `npm run build`, output directory `out`. Or upload directly
with `npx wrangler pages deploy out`. Set the `NEXT_PUBLIC_FIREBASE_*` variables in the
project settings for shared rankings; without them each visitor keeps their own scores.

## Scoring

A run starts at 10,000 points, loses 25 per second and 300 per wrong pair, and gains a 1,500
bonus for a flawless board. The floor is 500.

## Rankings

`lib/rankings.ts` writes to Firestore when the `NEXT_PUBLIC_FIREBASE_*` variables from
`.env.example` are set, and falls back to `localStorage` otherwise. Firestore setup: create a
project, add a web app, copy the config into `.env.local`, then allow reads and creates on the
`rankings` collection.

## Structure

- `lib/` deck, scoring, game state, rankings
- `components/` card, HUD, leaderboard, win overlay
- `app/` the two pages; design tokens live in `globals.css` (from `DESIGN.md`)

Card figures are icons from [lucide](https://lucide.dev) (ISC).
