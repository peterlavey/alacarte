import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// Use the same base path locally and in GitLab CI: '/'
// Per request, do NOT adjust base for Pages subpaths.
export default defineConfig(() => {
  return {
    plugins: [react()],
    base: './',
  }
})
