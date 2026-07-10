// Vercel Serverless Function.
// Mirrors the Vite dev proxy (vite.config.js) but for production:
// the frontend calls /api/tmdb/<path>, this function forwards it to
// TMDB with the token injected server-side, so the token never
// reaches the browser bundle.
//
// IMPORTANT: set TMDB_ACCESS_KEY (no VITE_ prefix) in Vercel's
// Environment Variables. Using the VITE_ prefix here would get it
// bundled into client-side JS, defeating the purpose.

export default async function handler(req, res) {
  const { path, ...query } = req.query;
  const tmdbPath = Array.isArray(path) ? path.join('/') : (path || '');

  const params = new URLSearchParams(query);
  const url = `https://api.themoviedb.org/3/${tmdbPath}${params.toString() ? `?${params.toString()}` : ''}`;

  try {
    const tmdbRes = await fetch(url, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_ACCESS_KEY}`,
      },
    });
    const data = await tmdbRes.json();
    // Prevent stale caching at the browser/CDN level — we want fresh
    // movie data, and a bad response getting cached (like the one from
    // the earlier rewrite bug) should never linger.
    res.setHeader('Cache-Control', 'no-store');
    res.status(tmdbRes.status).json(data);
  } catch (err) {
    console.error('TMDB proxy error:', err);
    res.setHeader('Cache-Control', 'no-store');
    res.status(502).json({ error: 'Failed to reach TMDB' });
  }
}
