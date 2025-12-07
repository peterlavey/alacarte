import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// Configure correct base path for GitLab Pages in CI
// In CI, GitLab provides CI_PROJECT_NAME; locally we keep '/'
export default defineConfig(() => {
  const isCI = process.env.CI === 'true' || !!process.env.GITLAB_CI
  const project = process.env.CI_PROJECT_NAME || ''
  const base = isCI && project ? `/${project}/` : '/'
  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
    },
    base: '/alacarte/',
  }
})
