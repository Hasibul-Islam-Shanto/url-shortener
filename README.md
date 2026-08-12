# URL Shortener

A full-stack URL shortener with user authentication, click analytics, and a management dashboard. It consists of a **Node.js/Express + MongoDB** REST API and a **React + TypeScript (Vite)** single-page app, both containerized and orchestrated with Docker Compose.

## Features

- User registration & login (JWT stored in HTTP-only cookies)
- Create, edit, list, and delete short URLs
- Public redirect endpoint that records per-click analytics (browser, OS, device, referrer, IP)
- Per-URL analytics and an aggregate dashboard
- Rate limiting, CORS, and security headers (Helmet)

## Tech Stack

| Layer     | Technology                                                                 |
| --------- | -------------------------------------------------------------------------- |
| Backend   | Node.js 20, Express 4, Mongoose 8, JWT, Zod, nanoid                         |
| Frontend  | React 19, TypeScript, Vite 8, Tailwind CSS 4, TanStack Query, React Router 7 |
| Database  | MongoDB 7                                                                   |
| Infra     | Docker, Docker Compose, Nginx (serves frontend & proxies the API)          |

---

## Project Structure

The repository is a monorepo with two independent apps and a root Compose file:

```
url-shortener/
├── docker-compose.yml      # Orchestrates mongo + backend + frontend
├── backend/                # Express REST API
└── frontend/               # React single-page app
```

### Backend (`backend/`)

Express API written in TypeScript and compiled to `dist/`. The source entry point is `src/server.ts`, which boots the app defined in `src/app.ts`; production runs `dist/server.js`.

```
backend/
├── Dockerfile
├── .dockerignore
├── .env.example            # Copy to .env for local dev
├── package.json
├── tsconfig.json           # Typecheck config
├── tsconfig.build.json     # Production build config
└── src/
    ├── server.ts           # Starts the HTTP server, connects to MongoDB
    ├── app.ts              # Express app: middleware + route mounting
    ├── config/             # Env parsing/validation, DB connection
    ├── controllers/        # Request handlers
    ├── services/           # Business logic
    ├── models/             # Mongoose schemas (User, Url, Analytics)
    ├── routes/             # Route definitions (auth, urls, dashboard, redirect)
    ├── middleware/         # Auth guard, rate limiters, error handling
    ├── validators/         # Zod request schemas
    ├── lib/                # Shared clients/helpers
    └── utils/              # Utility functions (short-code generation, etc.)
```

**API overview** — all REST routes are under `/api`; the public redirect lives at the root.

| Method | Endpoint                     | Auth | Description                         |
| ------ | ---------------------------- | ---- | ----------------------------------- |
| POST   | `/api/auth/register`         | No   | Register a new user                 |
| POST   | `/api/auth/login`            | No   | Log in (sets JWT cookie)            |
| POST   | `/api/auth/logout`           | No   | Log out (clears cookie)             |
| GET    | `/api/auth/me`               | Yes  | Get the current user                |
| PATCH  | `/api/auth/profile`          | Yes  | Update profile                      |
| POST   | `/api/urls`                  | Yes  | Create a short URL                  |
| GET    | `/api/urls`                  | Yes  | List URLs (filters + pagination)    |
| GET    | `/api/urls/:id`              | Yes  | Get a single URL                    |
| PATCH  | `/api/urls/:id`              | Yes  | Update a URL                        |
| DELETE | `/api/urls/:id`              | Yes  | Delete a URL                        |
| GET    | `/api/urls/:id/analytics`    | Yes  | Get analytics for a URL             |
| GET    | `/api/dashboard`             | Yes  | Aggregate dashboard stats           |
| GET    | `/:shortCode`                | No   | 302 redirect + record a click       |

### Frontend (`frontend/`)

React SPA built with Vite. Entry point is `src/main.tsx` → `src/App.tsx`. Organized by feature.

```
frontend/
├── Dockerfile
├── .dockerignore
├── .env.example            # Copy to .env for local dev
├── index.html
├── vite.config.ts          # Dev server on port 5173
├── nginx/
│   └── default.conf        # Serves build + proxies /api/ to the backend
└── src/
    ├── main.tsx            # App bootstrap
    ├── App.tsx             # Providers (Query client, router)
    ├── api/                # Axios instance & API calls
    ├── routes/             # Route configuration & guards
    ├── pages/              # Route-level pages
    ├── layouts/            # Page layouts (auth, dashboard shells)
    ├── features/           # Feature modules
    │   ├── auth/
    │   ├── urls/
    │   ├── dashboard/
    │   ├── analytics/
    │   └── profile/
    ├── components/         # Shared UI + layout components
    │   ├── ui/
    │   └── layout/
    ├── hooks/              # Reusable React hooks
    ├── store/              # Client-side state
    ├── services/           # Cross-cutting services
    ├── types/              # Shared TypeScript types
    └── utils/              # Helpers (e.g. buildShortUrl)
```

---

## Running Locally (without Docker)

### Prerequisites

- Node.js 20+
- A running MongoDB instance (local install or `docker run -p 27017:27017 mongo:7`)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env        # edit values as needed
npm run dev                 # http://localhost:8000 (tsx watch)
```

For production: `npm run build && npm start`. Other scripts: `npm run lint` (TypeScript typecheck), `npm test`.

Backend environment variables (`backend/.env.example`):

| Variable                | Example                                     | Notes                                  |
| ----------------------- | ------------------------------------------- | -------------------------------------- |
| `PORT`                  | `8000`                                      | Server port                            |
| `NODE_ENV`              | `development`                               | Environment                            |
| `MONGODB_URI`           | `mongodb://localhost:27017/url-shortener`   | **Required**                           |
| `JWT_SECRET`            | `replace-with-a-random-secret-at-least-32-characters` | **Required** — use a strong secret     |
| `JWT_EXPIRES_IN`        | `7d`                                        | Token lifetime                         |
| `COOKIE_NAME`           | `token`                                     | Auth cookie name                       |
| `CLIENT_URL`            | `http://localhost:5173`                     | CORS origin (frontend)                 |
| `BASE_URL`              | `http://localhost:8000`                     | Base used to build short URLs          |
| `RATE_LIMIT_WINDOW_MS`  | `900000`                                    | General rate-limit window (15 min)     |
| `RATE_LIMIT_MAX`        | `100`                                       | Max requests per window                |
| `AUTH_RATE_LIMIT_MAX`   | `10`                                        | Max auth requests per window           |
| `SHORT_CODE_LENGTH`     | `7`                                         | Generated short-code length            |
| `TRUST_PROXY`           | `false`                                     | Set `true` behind a reverse proxy      |

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev                 # http://localhost:5173
```

Other scripts: `npm run build` (typecheck + production build to `dist/`), `npm run preview`, `npm run lint`.

Frontend environment variables (`frontend/.env.example`):

| Variable                | Example                   | Notes                                              |
| ----------------------- | ------------------------- | -------------------------------------------------- |
| `VITE_API_BASE_URL`     | `http://localhost:8000`   | Axios base URL. Leave empty to use same-origin.    |
| `VITE_PUBLIC_BASE_URL`  | `http://localhost:8000`   | Base URL shown in generated short links            |

> Note: `VITE_PUBLIC_BASE_URL` points at the **backend**, since the public `GET /:shortCode` redirect lives there — not at the React app.

---

## Docker

Each app has its own image, and `docker-compose.yml` wires them together with MongoDB.

### How the images are built

**Backend** (`backend/Dockerfile`) — a multi-stage Node 20 Alpine image. The builder installs all dependencies and compiles TypeScript; the runner installs production dependencies only, copies `dist/`, and runs `node dist/server.js`.

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY tsconfig*.json ./
COPY src ./src
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 8000
CMD ["node", "dist/server.js"]
```

**Frontend** (`frontend/Dockerfile`) — a multi-stage build:

1. **Builder stage** (`node:20-alpine`): installs deps and runs `npm run build`. Vite bakes the `VITE_*` values in at build time, so they are passed as build args (`VITE_API_BASE_URL`, `VITE_PUBLIC_BASE_URL`).
2. **Runner stage** (`nginx:alpine`): copies the static `dist/` output into Nginx and applies `nginx/default.conf`, serving on port 80.

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_API_BASE_URL
ARG VITE_PUBLIC_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_PUBLIC_BASE_URL=$VITE_PUBLIC_BASE_URL
RUN npm run build

FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Because the frontend is built with an empty `VITE_API_BASE_URL` under Compose, the browser makes **same-origin** requests to `/api/...`, and Nginx proxies them to the backend container (`http://backend:8000/api/`). This avoids CORS in the Docker setup.

### How Docker Compose works

`docker-compose.yml` defines three services on a shared bridge network (`url_shortener_net`) so they can reach each other by service name:

| Service    | Image / Build          | Host → Container | Purpose                                  |
| ---------- | ---------------------- | ---------------- | ---------------------------------------- |
| `mongo`    | `mongo:7`              | not exposed      | Database; data persisted in a volume     |
| `backend`  | `./backend/Dockerfile` | `8000 → 8000`    | Express API                              |
| `frontend` | `./frontend/Dockerfile`| `3001 → 80`      | Nginx serving the SPA + proxying `/api/` |

Key details:

- **Startup order:** `frontend` depends on `backend`, which depends on `mongo` (via `depends_on`).
- **Networking:** All three share `url_shortener_net`. The backend reaches Mongo at `mongodb://mongo:27017/...` and Nginx reaches the API at `http://backend:8000` — using the Compose service names as hostnames.
- **Persistence:** MongoDB data lives in the named volume `mongo-data` (`/data/db`), so it survives container restarts.
- **Config:** The backend reads most settings from the `environment:` block in the Compose file. `JWT_SECRET` is intentionally required from your shell or root `.env` file, and Compose will fail fast if it is missing. The backend runs with `PORT=8000` and `TRUST_PROXY=false` in this local setup because the API port is published directly. The frontend receives its `VITE_*` values as build args.

### Run everything

From the repository root:

```bash
JWT_SECRET="$(openssl rand -hex 32)" docker compose up --build
```

Alternatively, create a git-ignored root `.env` file with `JWT_SECRET=...` before running Compose.

Then open:

- **Frontend UI:** http://localhost:3001
- **Backend API:** http://localhost:8000
- **Short links:** http://localhost:8000/{shortCode}

Useful commands:

```bash
docker compose up -d --build     # run in the background
docker compose logs -f backend   # follow a service's logs
docker compose down              # stop and remove containers
docker compose down -v           # also remove the mongo-data volume (wipes the DB)
```

> For local overrides, add a `docker-compose.override.yml` (already git-ignored).
`
