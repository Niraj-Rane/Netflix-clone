// All sensitive config is read from environment variables.
// Copy .env.example → .env and fill in your real values.
// NEVER hardcode secrets here.

const firebaseConfig = {
    apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// NOTE: the TMDB token is intentionally NOT exposed here anymore.
// It's read server-side only — by api/tmdb.js in production, and by
// vite.config.js's dev proxy locally — via VITE_TMDB_ACCESS_KEY /
// TMDB_ACCESS_KEY. The browser calls our own /api/tmdb proxy and never
// needs the real token. See src/lib/tmdb.js.

export { firebaseConfig };
