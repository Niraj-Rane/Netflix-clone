# Netflix Clone

A Netflix-inspired movie browsing app built with React and Firebase, using live movie data from The Movie Database (TMDB) API.

> Note: this is a learning/portfolio project inspired by Netflix's UI. Not affiliated with or endorsed by Netflix.

## Features

- **User authentication** — sign up, sign in, and sign out with Firebase Authentication (email/password); user profiles stored in Firestore
- **Protected browsing** — logged-out users are redirected to the login screen
- **Movie rows by category** — Popular, Top Rated, Upcoming, and Now Playing, pulled live from TMDB
- **Trailer playback** — click any movie to open a dedicated player page with its embedded YouTube trailer
- **Responsive hero banner** with horizontally scrollable movie rows
- **Toast notifications** for auth errors (via react-toastify)

## Tech Stack

- **Frontend:** React 18, React Router v6, Vite
- **Auth & Database:** Firebase Authentication, Firestore
- **Data source:** [TMDB API](https://www.themoviedb.org/documentation/api)
- **Notifications:** react-toastify

## Getting Started

### Prerequisites
- Node.js (v18+)
- A free [TMDB account](https://www.themoviedb.org/signup) and API Read Access Token
- A [Firebase project](https://console.firebase.google.com/) with Email/Password authentication enabled

### Installation

```bash
git clone <your-repo-url>
cd Project
npm install
```

### Environment variables

Create a `.env` file in the project root (see `.env.example`):

```
VITE_TMDB_ACCESS_KEY=your_tmdb_read_access_token
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Get your Firebase values from **Project Settings → General → Your apps** in the Firebase console. Get your TMDB token from **Settings → API** in your TMDB account.

### Run locally

```bash
npm run dev
```

Visit `http://localhost:5173`.

### Build for production

```bash
npm run build
```

## Known Issues / Roadmap

See [`Fix.md`](./Fix.md) for the full list of tracked bugs and planned features (search, watchlist, nav routing, etc.).

## License

This project is for educational/portfolio purposes.
