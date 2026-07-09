# Fix List — Netflix Clone

Tracked issues and progress for this project, ordered by priority.

---

## 🚨 Security

- [x] **Hardcoded TMDB Bearer token removed from source** — moved to `VITE_TMDB_ACCESS_KEY` in `.env` (git-ignored), read via `src/config.js`.
- [x] **Firebase config moved to `.env`** — using a real personal Firebase project instead of the tutorial's shared demo project.
- [x] **`.env.example` added** — safe template for anyone cloning the repo, no real secrets committed.

## 🔴 Core Features

- [x] **My List / watchlist** — fully implemented: bookmark button on cards and player page, backed by Firestore (`watchlist` collection), real-time updates via `onSnapshot`, remove functionality, empty/loading states.
- [x] **Home nav link** wired to `/`.
- [x] **My List nav link** wired to `/my-list`.
- [x] **Hero "Play" button** now navigates to a real trailer (`/player/27205` — Inception).
- [ ] **Search** — search icon in navbar still has no functionality. Needs a search input + TMDB `/search/movie` call + results view.
- [ ] **TV Shows / Movies / New & Popular / Browse by Languages** nav links — still static text, not routed. (TV Shows would need TMDB's `/tv` endpoints, separate from the current `/movie` ones — bigger effort.)

## 🟡 Bugs — all fixed

- [x] `Player.jsx` now uses `useLocation()` properly instead of the broken `props.location` (v5-style) pattern.
- [x] Leftover debug code and placeholder `dataToPass` object removed from `TitleCards.jsx`.

## 🟢 Infra / Architecture

- [x] **TMDB requests proxied through Vite's dev server** (`vite.config.js` → `/api/tmdb`) — solves both the CORS issue and the local ISP-level blocking of `themoviedb.org` some networks in India enforce, since the actual outbound request now happens from the Node dev server, not the browser.
- [ ] **Production equivalent of the proxy** — Vite's `server.proxy` only applies in `npm run dev`, not in the built production app. Before deploying (Vercel/Netlify), this needs an equivalent: a small serverless function (e.g. `/api/tmdb/[...path].js` on Vercel) that does the same server-side proxying with the token injected there instead of client-side.

## Low Priority / Polish

- [ ] Typo in folder name: `src/components/TitileCards/` → should be `TitleCards/` (cosmetic only, low priority).
- [ ] Loading states while TMDB requests are in flight on Home/TitleCards.
- [ ] User-facing error UI if a TMDB fetch fails (currently only `console.error`).
- [ ] Responsive/mobile pass.
- [ ] Deploy live (Vercel/Netlify) and add the link to `README.md`.

---

## Suggested order of remaining work
1. Production TMDB proxy (needed before deploying at all).
2. Deploy live + add demo link to README.
3. Search functionality.
4. Remaining nav links.
5. Polish items as time allows.
