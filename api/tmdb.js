// Vercel Serverless Function — fixed path, no dynamic file routing involved
// (that was the source of the 404s). The frontend calls:
//   /api/tmdb?path=movie/popular&language=en-US&page=1
// and this forwards to TMDB with the token injected server-side.
//
// IMPORTANT: set TMDB_ACCESS_KEY (no VITE_ prefix) in Vercel's
// Environment Variables — using VITE_ here would bundle it into
// client-side JS, defeating the purpose.

export default async function handler(req, res) {
  const { path, ...query } = req.query;

  if (!path) {
    res.status(400).json({ error: 'Missing "path" query parameter' });
    return;
  }

  const params = new URLSearchParams(query);
  const url = `https://api.themoviedb.org/3/${path}${params.toString() ? `?${params.toString()}` : ''}`;

  try {
    const tmdbRes = await fetch(url, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_ACCESS_KEY}`,
      },
    });
    const data = await tmdbRes.json();
    res.setHeader('Cache-Control', 'no-store');
    res.status(tmdbRes.status).json(data);
  } catch (err) {
    console.error('TMDB proxy error:', err);
    res.setHeader('Cache-Control', 'no-store');
    res.status(502).json({ error: 'Failed to reach TMDB' });
  }
}
