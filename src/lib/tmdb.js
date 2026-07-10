// Builds a URL for our own /api/tmdb proxy (Vercel function in prod,
// Vite dev-server proxy in local dev — see vite.config.js).
//
// No Authorization header is set here on purpose: the real TMDB token
// never needs to reach the browser. The proxy (server-side, in both
// dev and prod) injects it itself.
//
// `pathWithMaybeQuery` can be a plain TMDB path ("movie/popular") or
// one that already has query params ("discover/movie?with_original_language=hi").
export function tmdbUrl(pathWithMaybeQuery, extraParams = {}) {
  const [rawPath, existingQuery = ''] = pathWithMaybeQuery.split('?');
  const params = new URLSearchParams(existingQuery);
  Object.entries(extraParams).forEach(([key, value]) => params.set(key, value));
  params.set('path', rawPath);
  return `/api/tmdb?${params.toString()}`;
}

export const tmdbFetchOptions = {
  method: 'GET',
  headers: {
    accept: 'application/json',
  },
};
