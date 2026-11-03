# React Query Movies

Movie search with pagination, built with React, TypeScript, Vite, TanStack Query and TMDB.

## Run locally

1. Install dependencies with `npm install` (generates `package-lock.json`).
2. Create `.env.local` in the project root and add `VITE_TMDB_TOKEN=your_api_read_access_token`.
3. Start the development server with `npm run dev`.

## Checks

- `npm run build`
- `npm run lint`

## Deployment

When importing this project into Vercel, select Vite, keep `./` as the root and add the `VITE_TMDB_TOKEN` environment variable before deploying. The token is used client-side in this educational project; Vite embeds `VITE_*` values in the browser build.

This product uses the TMDB API but is not endorsed or certified by TMDB.
