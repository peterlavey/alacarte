import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
// Use the same base path locally and in GitLab CI: '/'
// Per request, do NOT adjust base for Pages subpaths.
export default defineConfig(() => {
  return {
    plugins: [react()],
    base: './',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
