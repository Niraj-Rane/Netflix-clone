# Fix List — Netflix Clone

Tracked issues and pending work for this project, ordered by priority. Each item lists the affected file(s) and what needs to change.

---

## 🚨 Critical — Security

### 1. Hardcoded TMDB Bearer token in source
**File:** `src/config.js`
The `TMDB_Access_Key` constant contains a live TMDB Read Access Token in plain text.

**Fix:**
- Revoke/regenerate the token on themoviedb.org (treat the current one as compromised — it's already in git history).
- Move it into a `.env` file as `VITE_TMDB_ACCESS_KEY=...`.
- Add `.env` (and allow `.env.example`) to `.gitignore`.
- Update `config.js` to read `import.meta.env.VITE_TMDB_ACCESS_KEY` instead of the hardcoded string.
- Update every file that imports `TMDB_Access_Key` from `config.js`:
  - `src/components/TitileCards/TitleCards.jsx`
  - `src/pages/Player/Player.jsx`

**Note on Firebase config:** the `firebaseConfig` object in the same file is *not* a secret in the same sense — Firebase API keys are safe to expose client-side and are meant to be public; actual data access is controlled by Firestore Security Rules. Still fine to move to env vars for cleanliness, but not urgent for security.

---

## 🔴 High — Missing Core Features

### 2. Search does nothing
**File:** `src/components/Navbar/Navbar.jsx`
The search icon (`search_icon`) has no click handler and there's no search input/results UI anywhere.

**Fix:** Add a toggleable search input in the navbar. On submit, call TMDB's `/search/movie` endpoint and render results (reuse the card UI from `TitleCards`).

### 3. Nav links are static (no routing)
**File:** `src/components/Navbar/Navbar.jsx`
`Home`, `TV Shows`, `Movies`, `New & Popular`, `My List`, `Browse by Languages` are plain `<li>` text with no `onClick` or `<Link>`.

**Fix:** Wire at least `Home` and `My List` to real routes. `TV Shows` would need TMDB's `/tv` endpoints instead of `/movie` (bigger effort — can be a stretch goal).

### 4. No "My List" / watchlist
**Files:** new — e.g. `src/pages/MyList/MyList.jsx`, plus a Firestore collection
Currently there's no way to save a movie for later.

**Fix:**
- Add a "+" / bookmark button on each card (`TitleCards.jsx`) and on `Player.jsx`.
- Store `{ uid, movieId, addedAt }` in a Firestore `watchlist` collection.
- Add a `/my-list` route that queries Firestore for the current user's saved items and renders them with `TitleCards`-style cards.

### 5. Hero "Play" button does nothing
**File:** `src/pages/Home/Home.jsx`
The hero banner's `Play` button has no `onClick`.

**Fix:** Since the hero movie is currently static (hardcoded banner image/caption), either hardcode a movie ID for it to link to `/player/:id`, or fetch a real "featured" movie from TMDB and use its id.

---

## 🟡 Medium — Bugs

### 6. Broken `props.location` in Player
**File:** `src/pages/Player/Player.jsx`
```js
const state = props.location;
...
<p>{state}</p>
```
This is a leftover from React Router v5. With v6's `<Route path='/player/:id' element={<Player/>}/>`, no props are passed this way, so `state` is always `undefined` and renders nothing.

**Fix:** Use `useLocation()` from `react-router-dom` to read passed state, or pass the movie title via the URL/query param, or just remove the line/`<p>` if it's not needed.

### 7. Leftover debug code
**File:** `src/pages/Player/Player.jsx` — `console.log(props)` inside the `useEffect`.
**File:** `src/components/TitileCards/TitleCards.jsx` — unused `dataToPass` object with hardcoded placeholder data (`{ name: 'John Doe', age: 25 }`) passed as router state to every card link.

**Fix:** Remove both — clean up before treating this as a portfolio piece.

### 8. Typo in folder name
**Path:** `src/components/TitileCards/` should be `TitleCards/` (missing letters transposed).
**Fix:** Rename folder + update the one import in `Home.jsx`. Low priority, cosmetic, but worth fixing before sharing the repo publicly.

---

## 🟢 Low — Polish

- [ ] Loading states while TMDB requests are in flight (currently cards/player just render empty until data arrives).
- [ ] Error UI if a TMDB fetch fails (currently only `console.error`, user sees nothing).
- [ ] Responsive/mobile pass — verify horizontal card scroll and hero layout on small screens.
- [ ] Deploy live (Vercel/Netlify) and add the link to `README.md`.
- [ ] Add a `LICENSE` file if this will be public (MIT is standard for portfolio projects, but the original tutorial's license should be checked/credited).

---

## Suggested order of work
1. Fix #1 (security) — do this first, before anything else, regardless of what else you're working on.
2. Fix #6 and #7 (quick bug/cleanup wins).
3. Fix #2 and #3 (search + nav routing) — biggest visible functionality gap.
4. Fix #4 (My List) — biggest "full-stack" resume signal.
5. Fix #5, #8, and the Low/polish items as time allows.
