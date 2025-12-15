// Centralized BACKEND URL for frontend
// Primary env var: VITE_BACKEND_URL
// Backward-compatible fallbacks: VITE_API_BASE_URL, VITE_API_BASE

const envBackend = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE;

if (!envBackend) {
  // Helpful developer message when no env is configured. We still fall back to localhost
  // so the app can run during local dev, but set VITE_BACKEND_URL in Vercel or .env for production.
  // eslint-disable-next-line no-console
  console.error(
    '[DesignAgent] VITE_BACKEND_URL (or VITE_API_BASE_URL/VITE_API_BASE) is not set. Falling back to http://localhost:8000.\n' +
      'Set VITE_BACKEND_URL in your frontend .env or in your Vercel environment variables for production.'
  );
}

export const BACKEND_URL = envBackend || 'http://localhost:8000';

// Keep BASE_URL for backwards compatibility
export const BASE_URL = BACKEND_URL;

export default BACKEND_URL;
