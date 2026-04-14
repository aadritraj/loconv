import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process';

const getCommitHash = () => {
  if (process.env.CF_PAGES_COMMIT_SHA) {
    // Cloudflare pages provides the entire commit hash, this shortens it
    // to the length returned by the method below
    return process.env.CF_PAGES_COMMIT_SHA.substring(0, 7);
  };

  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    return 'unknown';
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __COMMIT_HASH__: JSON.stringify(getCommitHash()),
  }
})
