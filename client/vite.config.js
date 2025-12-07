import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// Configure correct base path for GitLab Pages in CI
// In CI, GitLab provides CI_PROJECT_NAME; locally we keep '/'
export default defineConfig(() => {
  const isCI = process.env.CI === 'true' || !!process.env.GITLAB_CI
  // Derive base path robustly in GitLab CI to avoid relative asset URLs
  let base = '/'
  if (isCI) {
    // Prefer CI_PAGES_URL when available: e.g., https://<ns>.gitlab.io/<project>
    const pagesUrl = process.env.CI_PAGES_URL
    if (pagesUrl) {
      try {
        const pathname = new URL(pagesUrl).pathname // "/" or "/alacarte"
        // Ensure trailing slash
        base = pathname.endsWith('/') ? pathname : pathname + '/'
      } catch (_) {
        // Fallback to CI_PROJECT_NAME
        const project = process.env.CI_PROJECT_NAME || ''
        base = project ? `/${project}/` : '/'
      }
    } else {
      const project = process.env.CI_PROJECT_NAME || ''
      base = project ? `/${project}/` : '/'
    }
  }
  return {
    plugins: [react()],
    base,
  }
})
