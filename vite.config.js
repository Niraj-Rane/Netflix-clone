import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env vars so the proxy can use VITE_TMDB_ACCESS_KEY server-side
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/tmdb': {
          target: 'https://api.themoviedb.org',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/tmdb/, '/3'),
          // Inject the Authorization header server-side so it's never dropped
          headers: {
            Authorization: `Bearer ${env.VITE_TMDB_ACCESS_KEY}`,
            Accept: 'application/json',
          },
        },
      },
    },
  }
})
