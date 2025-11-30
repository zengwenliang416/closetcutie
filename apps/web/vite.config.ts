import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  return {
    root: '.',
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@closetcutie/types': path.resolve(__dirname, '../../packages/types/src'),
        '@closetcutie/services': path.resolve(__dirname, '../../packages/services/src')
      }
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/ai': {
          target: 'http://localhost:8787',
          changeOrigin: true
        }
      }
    }
  }
})
