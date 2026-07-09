# Fix List — Netflix Clone

Tracked issues and progress for this project, ordered by priority.

---

## 🚨 Security

- [x] Hardcoded TMDB Bearer token removed from source — moved to `VITE_TMDB_ACCESS_KEY` in `.env` (git-ignored), read via `src/config.js`.
- [x] Firebase config moved to `.env` — using a real personal Firebase project instead of the tutorial's shared demo project.
- [x] `.env.example` added — safe template for anyone cloning the repo, no real secrets committed.

## 🔴 Core Features

- [x] **My List / watchlist** — Firestore-backed, real-time updates, add/remove, works for both movies and TV shows.
- [x] **Search** — type-ahead search in the navbar, debounced TMDB query, dropdown of results with poster + year, click to open player.
- [x] **Nav links wired:**
  - Home → `/`
  - Movies → `/` (Home already shows movie categories exclusively)
  - TV Shows → `/tv-shows` (new page, TMDB `/tv` endpoints — popular, top rated, airing today, on the air)
  - New & Popular → `/new-popular` (new page — now playing, upcoming, trending, plus a TV row)
  - My List → `/my-list`
  - Browse by Languages → `/languages` (new page — language picker using TMDB `discover` with `with_original_language`)
- [x] Hero "Play" button navigates to a real trailer.

## 🟡 Bugs — all fixed

- [x] `Player.jsx` uses `useLocation()` properly instead of the broken `props.location` pattern.
- [x] Leftover debug code / placeholder data removed.
- [x] Folder typo fixed: `TitileCards` → `TitleCards` (and the one import updated).

## 🟢 Polish

- [x] **Loading states** — `TitleCards` shows "Loading titles…" while fetching; `Player` shows a loading placeholder before the trailer is ready.
- [x] **User-facing error handling** — `TitleCards` shows a retry button on fetch failure instead of silently failing; `Player` shows "Couldn't load a trailer" instead of an empty/broken iframe.
- [x] **Responsive pass on new pages** (TV Shows, New & Popular, Languages, search dropdown) — mobile breakpoints added matching the existing site conventions.
- [ ] Broader responsive audit on the original tutorial pages (Home/Player) — they already ship with some breakpoints from the tutorial; worth a manual pass on a real phone before calling this fully done.

## 🟢 Infra / Architecture

- [x] TMDB requests proxied through Vite's dev server (`vite.config.js` → `/api/tmdb`) — solves CORS and local ISP-level blocking.
- [ ] **Production equivalent of the proxy** — still needed before deploying. Vite's `server.proxy` only works in `npm run dev`; the built app will need a serverless function (Vercel/Netlify) doing the same job with the token injected server-side.

---

## What's left
1. **Deploy** — pick a host, add the production proxy, get a live demo link, add it to `README.md`.
2. Optional: broader manual responsive/mobile testing pass.
3. Optional stretch: language filter for TV shows too (currently movies only); genre-based filtering.
