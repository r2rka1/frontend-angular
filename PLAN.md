# frontend-angular — Implementation Plan

Angular SPA that lets a user register/login, dispatch a "fetch Wikipedia space articles" job,
poll its status, and browse the resulting articles.

## Stack

- Angular (latest stable, standalone components, signals)
- TypeScript (strict mode)
- TailwindCSS
- RxJS for HTTP, Angular Router for navigation
- ESLint + Prettier
- Karma/Jasmine (default) for unit tests
- Dockerfile (multi-stage: node build → nginx serve)

## High-level features

1. Auth: register, login, logout, persisted token
2. Dashboard: greeting + "Fetch new articles" button → creates a job
3. Job status: polling spinner until job completes
4. Articles list: paginated list of articles fetched for this user
5. Article detail: full article body with link back to Wikipedia source

## Project layout

```
src/
  app/
    core/
      auth/
        auth.service.ts        # login/register/logout/me, token storage
        auth.guard.ts          # route guard
        auth.interceptor.ts    # attaches Bearer token
        auth.models.ts
      api/
        api.config.ts          # base URL from environment
        articles.service.ts    # fetch jobs + list/detail
        jobs.service.ts        # poll job status
      models/
        article.model.ts
        job.model.ts
        user.model.ts
    features/
      auth/
        login/login.component.ts
        register/register.component.ts
      dashboard/dashboard.component.ts
      articles/
        articles-list/articles-list.component.ts
        article-detail/article-detail.component.ts
    layout/
      shell/shell.component.ts     # top nav + router-outlet
    app.routes.ts
    app.config.ts
  environments/
    environment.ts
    environment.development.ts
  styles.css                       # tailwind directives
tailwind.config.js
postcss.config.js
Dockerfile
nginx.conf
```

## Routes

| Path | Component | Guard |
|---|---|---|
| `/login` | LoginComponent | guest only |
| `/register` | RegisterComponent | guest only |
| `/` | DashboardComponent | auth |
| `/articles` | ArticlesListComponent | auth |
| `/articles/:id` | ArticleDetailComponent | auth |

## API contract (consumes Main API)

- `POST /api/register` → `{ user, token }`
- `POST /api/login` → `{ user, token }`
- `POST /api/logout` → `204`
- `GET  /api/me` → `{ user }`
- `POST /api/articles/fetch-job` → `{ job_id, status }`
- `GET  /api/jobs/:id` → `{ id, status, finished_at }`
- `GET  /api/articles?page=N` → `{ data: Article[], meta }`
- `GET  /api/articles/:id` → `{ article }`

## Auth flow

1. Login form posts to `/api/login`
2. Token stored in `localStorage` under `auth_token`
3. `AuthInterceptor` attaches `Authorization: Bearer <token>`
4. `AuthGuard` redirects to `/login` if token missing or `/me` returns 401
5. On 401 from any request → clear token, redirect to login

## Job polling flow

1. User clicks "Fetch articles" → `POST /api/articles/fetch-job` → receive `job_id`
2. `JobsService.poll(id)` emits via `interval(2000).pipe(switchMap(...))` until status ∈ `done|failed`
3. On `done` → refresh articles list
4. On `failed` → toast error

## Implementation steps

1. **Scaffold**: `ng new frontend-angular --standalone --routing --style=css --strict`
2. **Tailwind**: install `tailwindcss postcss autoprefixer`, init config, add `@tailwind` directives
3. **Environments**: set `apiBaseUrl` in `environment.ts`
4. **Core services**: `AuthService`, `ArticlesService`, `JobsService`
5. **Interceptor + Guard**: register in `app.config.ts`
6. **Layout shell** with nav showing user email + logout
7. **Auth pages**: reactive forms with validation, error display
8. **Dashboard**: button + current job state
9. **Articles list/detail**: cards with title, snippet, fetched_at
10. **Dockerfile**: multi-stage build, served by nginx
11. **README** with run instructions

## Done criteria

- `npm run build` succeeds with no warnings
- `npm run lint` clean
- App runs against Main API at `http://localhost:8000`
- Manual flow works: register → login → fetch job → see articles → open article
