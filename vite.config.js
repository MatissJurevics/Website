import { defineConfig } from 'vite' // HMR Trigger
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/gitea': {
        target: 'https://git.mati.ss',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/gitea/, '')
      }
    }
  }
})
