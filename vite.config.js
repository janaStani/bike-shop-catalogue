import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/img': {
          target: env.VITE_SUPABASE_URL,
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(/^\/img\//, '/storage/v1/object/public/product-images/'),
        },
      },
    },
  }
})
