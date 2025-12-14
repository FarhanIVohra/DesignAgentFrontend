# DesignAgent — Frontend skeleton

This repository contains a starter React + Vite frontend scaffold with TailwindCSS and Axios. It implements the folder structure and placeholder components requested in the pasted prompt.

Files created include the `src` structure with pages, components, API layer, context, utils and a minimal Vite + Tailwind setup.

Quick start (PowerShell):

```powershell
# install dependencies
npm install

# start development server
npm run dev
```

Notes:
- This is a skeleton: UI placeholders only, no backend integration completed.
- Tailwind is configured, but you must run `npm install` to fetch dependencies before dev server.
- API baseUrl is configured in `src/api/axiosClient.js` with a default of `http://localhost:4000/api`. Override using environment variables if needed.

Next steps:
- Add routing (react-router) and wire pages to routes.
- Implement file upload logic and connect to the DesignAgent backend APIs.
- Add tests, linting and CI as needed.
