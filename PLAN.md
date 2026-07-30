# Memory Card Game - Refactor Plan

Refactor of the lit-element prototype into a client-rendered Next.js app, per AGENTS.md.
Two pages only: presentation (with rankings) and game.

Status: complete. 25 unit tests and 5 Playwright tests green, production build clean.
One caveat is recorded under Phase 4.

The app was built in `frontend/` as the spec asked, then moved to the repo root on request;
the lit-element prototype has been deleted.

## Phase 1 - Scaffolding

- [x] Next.js (App Router, TypeScript, client rendered), now at the repo root
- [x] `.gitignore` covers `node_modules`, `.next`, build output, env files, test artifacts
- [x] Design tokens from DESIGN.md exposed as CSS variables in one place (`app/globals.css`)
- [x] Vitest + Playwright configured, `npm test` and `npm run test:e2e` wired up
- [x] `npm run build` passes with no type or lint errors

## Phase 2 - Game core (pure logic, unit tested)

- [x] `lib/cards.ts` builds a shuffled 12-card deck (6 pairs) with stable ids
- [x] `lib/scoring.ts` derives points from elapsed time and error count
- [x] `lib/useMemoryGame.ts` state machine: idle -> preview -> playing -> won
- [x] Two-card flip resolution: match locks the pair, mismatch flips back and counts an error
- [x] Board is input-locked while a mismatch is resolving
- [x] Unit tests cover deck construction, scoring boundaries, and full-game flow

## Phase 3 - UI/UX

- [x] Presentation page: title, one line, CTA, ranking table - nothing else
- [x] Favicon (`app/icon.svg`)
- [x] Game page: HUD (time, errors, live score), board, win overlay with score submit
- [x] Card faces use open-source cyberpunk-cute figures, one per pair (lucide, ISC)
- [x] Match effect: card burst/glow plus a MATCH / COMBO xN pulse over the board
- [x] Near-black canvas, hairline cards, pill buttons, mono eyebrows per DESIGN.md
- [x] Whole board fits the viewport at 390x844, 1280x900 and 1440x780 - no scrolling
- [x] Respects `prefers-reduced-motion`

## Phase 4 - Persistence

- [x] Rankings read/write through a single `lib/rankings.ts` module
- [x] Firestore used when `NEXT_PUBLIC_FIREBASE_*` env vars are present
- [x] localStorage fallback so the MVP runs with no credentials
- [x] Top 10 scores, sorted by points desc, ties broken by the faster run

Caveat: no Firebase project exists for this repo, so the Firestore path is written but only
exercised through the localStorage fallback. Tests cover the fallback and the sorting.

## Phase 5 - Integration testing

- [x] Playwright: presentation renders and navigates to the game
- [x] Playwright: full game played to completion, score submitted, appears in rankings
- [x] Playwright: mismatch flips cards back and increments errors
- [x] Playwright: replay deals a fresh board
- [x] All defects found are fixed, suites green

## Phase 6 - Delivery

- [x] Minimal README at the repo root
- [x] Dev server running and reachable for the user
