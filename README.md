# NumTalk

Full-stack assessment project where discussions are built with numbers and arithmetic operations. The solution ships an Express/TypeScript API with Prisma/Postgres storage plus a React/Vite front-end using React Query for data fetching.

## Requirements Recap

- Unregistered users can view the full discussion tree.
- Visitors can register and authenticate with username/password.
- Authenticated users can start a discussion by posting a starting number.
- Authenticated users can respond to any calculation by choosing an operation (+, −, ×, ÷) and their own operand.

## Project Structure

```
client/  # React + Vite single-page app
server/  # Express API + Prisma schema + Jest tests
```

## Prerequisites

- Node.js 20+
- Docker Desktop (optional, for compose stack)

## Local Development

### 1. API

```powershell
cd server
cp .env.example .env  # ensure DATABASE_URL points to your Postgres instance
npm install
npx prisma generate
npm run dev
```

Set `ALLOWED_ORIGINS` in `server/.env` to a comma-separated list of front-end URLs (e.g., `http://localhost:5173,https://your-app.vercel.app`) so the API emits the proper CORS headers for both local dev and hosted builds.

If you do not have Postgres locally, run the provided Docker Compose stack (below) and reuse the connection string from `docker-compose.yml`.

Run tests and build checks:

```powershell
npm test
npm run test:coverage
npm run build
```

### 2. Front-end

```powershell
cd client
npm install
npm run dev
```

The client reads `VITE_API_URL` from Vite env files; `.env` now defaults to `http://localhost:4000` for local work. Override it per-environment (e.g., via `.env.production` locally or Vercel environment variables) when pointing to a hosted API.

### 3. Keeping Vercel + ngrok alive

Vercel only reaches your API while the tunnel and local server are running. Each work session:

```powershell
# terminal 1 – API
cd server
npm run dev

# terminal 2 – tunnel (ngrok account + reserved domain required)
ngrok http 4000 --domain=newsworthy-kristian-noninterchangeably.ngrok-free.dev
```

Then:

- Make sure `ALLOWED_ORIGINS` in `server/.env` lists `http://localhost:5173`, the ngrok domain, and `https://num-talk-git-main-hasnat005s-projects.vercel.app`.
- Update Vercel’s `VITE_API_URL` env var to the current ngrok HTTPS URL and redeploy the frontend whenever the tunnel changes.
- Verify the tunnel is really proxying your API (`Invoke-WebRequest https://<domain>/api/health`) so the response body is JSON, not the ngrok splash page shown in your screenshot.

### 4. Docker Compose

```powershell
cd project-root
docker compose up --build
```

Services:
- `db` – Postgres 15
- `server` – API exposed on `http://localhost:4000`
- `client` – SPA served from Nginx at `http://localhost:5173`

## Tech Decisions

- **Prisma** for schema-first modeling, migrations, and type-safe database access.
- **JWT** stored in memory/localStorage to keep implementation simple; React Query invalidates cached trees on each mutation.
- **React Query + Axios** manages data fetching, error states, and optimistic refreshes.
- **Component-first UI** avoids CSS frameworks in favor of lightweight utility styles in `src/styles.css`.

## Testing & Coverage

- Backend unit tests live under `server/tests`. Run `npm test` (quick) or `npm run test:coverage` for instrumentation and coverage output.
- Frontend build is validated via `npm run build` (includes TypeScript project references). Add Vitest/RTL later if interaction tests are required.

## Future Enhancements

- Add pagination/virtualization for extremely large trees.
- Server-side rate limiting and audit logging.
- More extensive Jest suites (service/controller tests) plus React Testing Library for components.
- CI workflow (GitHub Actions) to run `npm test`, `npm run build`, and Docker image builds.
