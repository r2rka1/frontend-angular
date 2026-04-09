# frontend-angular

Angular 21 + TailwindCSS + TypeScript SPA. Companion to
[`main-api`](https://github.com/r2rka1/main-api) and
[`wiki-service`](https://github.com/r2rka1/wiki-service).

Lets a user register / log in, dispatch a job to fetch Wikipedia articles
about Space, and browse the resulting articles.

See [PLAN.md](./PLAN.md) for the full implementation plan.

## Prerequisites

- Node.js 20+ (tested on Node 22)
- npm 10+
- A running [`main-api`](https://github.com/r2rka1/main-api) on `http://localhost:8000`
- A running [`wiki-service`](https://github.com/r2rka1/wiki-service) on `http://localhost:8001`
  (only needed for the article-fetch flow)

## Setup

```bash
git clone git@github.com:r2rka1/frontend-angular.git
cd frontend-angular

npm install
```

If `main-api` runs somewhere other than `http://localhost:8000`, edit
`src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8000/api',
};
```

> Make sure the URL matches `FRONTEND_URL` in `main-api/.env` (CORS allow-list)
> and that `main-api` is reachable from your browser.

## Run locally

```bash
npm start
# or: npx ng serve
```

App is now at `http://localhost:4200`.

## Build for production

```bash
npm run build
# output: dist/frontend-angular/
```

## Run tests

```bash
npm test
# or: npx ng test --watch=false
```

Uses Vitest with jsdom — no browser required.

## Manual end-to-end flow

With all three services running:

1. Open <http://localhost:4200> — you should be redirected to `/login`.
2. Click **Register**, create an account.
3. After registration you land on the dashboard.
4. Click **Fetch new articles** — the UI dispatches a job to `main-api`,
   which forwards to `wiki-service`, which queues
   `FetchSpaceArticlesJob`. The dashboard polls every 2s until the job
   reaches `done` (make sure the wiki-service queue worker is running).
5. Click **View articles →** to see the list, click any item for the detail
   view.

## Project layout

- `src/app/core/auth/` — `AuthService`, interceptor, guards
- `src/app/core/api/` — `ArticlesService`, `JobsService`
- `src/app/core/models/` — `User`, `Article`, `Job` interfaces
- `src/app/features/auth/` — login, register
- `src/app/features/dashboard/` — dashboard with fetch button + polling
- `src/app/features/articles/` — list + detail
- `src/app/layout/shell.component.ts` — top nav + `<router-outlet />`
- `src/environments/environment.ts` — API base URL

## Stack

- Angular 21 (standalone components, signals, control flow blocks)
- TailwindCSS 3 with PostCSS
- TypeScript strict mode
- RxJS + Angular HttpClient + functional interceptors
- Vitest for unit tests
