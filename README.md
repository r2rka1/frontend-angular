# frontend-angular

Angular + Tailwind + TypeScript SPA. Companion to [`main-api`](../main-api) and
[`wiki-service`](../wiki-service).

Lets a user register / log in, dispatch a job to fetch Wikipedia articles about Space,
and browse the resulting articles.

See [PLAN.md](./PLAN.md) for the full implementation plan.

## Status

Scaffolding only — not yet implemented. Skills available under `.claude/skills/`.

## Quick start (after implementation)

```bash
npm install
npm start            # http://localhost:4200
```

Configure `src/environments/environment.development.ts` with the Main API base URL.
