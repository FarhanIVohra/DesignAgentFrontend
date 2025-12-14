// Centralized API base URL for frontend
// Reads from Vite env var: VITE_API_BASE_URL

const raw = import.meta.env.VITE_API_BASE_URL;

if (!raw) {
  // Clear and actionable message for developers when env is missing
  // We still set a safe fallback so the app can run during local dev
  // but it's important to configure VITE_API_BASE_URL in .env or on the host.
  // eslint-disable-next-line no-console
  console.error(
    '[DesignAgent] VITE_API_BASE_URL is not set. Falling back to http://localhost:8000.\n' +
      'Set VITE_API_BASE_URL in your frontend .env file or in your deployment environment variables.'
  );
}

export const BASE_URL = raw || 'http://localhost:8000';

export default BASE_URL;
