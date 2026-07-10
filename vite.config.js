import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env vars so the proxy can use VITE_TMDB_ACCESS_KEY server-side
  // (this runs in Node during `vite dev`, never bundled into client JS).
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [react()],
    server: {
      proxy: {
        // Mirrors api/tmdb.js (the Vercel function used in production).
        // Frontend always calls /api/tmdb?path=<tmdb-path>&<params>,
        // in both dev and prod, via src/lib/tmdb.js.
        '/api/tmdb': {
          target: 'https://api.themoviedb.org',
          changeOrigin: true,
          secure: true,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Authorization', `Bearer ${env.VITE_TMDB_ACCESS_KEY}`);
              proxyReq.setHeader('Accept', 'application/json');
            });
          },
          rewrite: (path) => {
            const url = new URL(path, 'http://localhost');
            const tmdbPath = url.searchParams.get('path') || '';
            url.searchParams.delete('path');
            const qs = url.searchParams.toString();
            return `/3/${tmdbPath}${qs ? `?${qs}` : ''}`;
          },
        },
      },
    },
  }
})
