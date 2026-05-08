# Intelekt Marketplace

Intelekt Marketplace is an AI-native marketplace where clients describe business problems and get matched with AI freelancers, agencies, AI products, AI agents, and productized service packages.

This repository is the production-grade Next.js App Router foundation. It intentionally does not implement marketplace business logic yet; the current goal is a clean, runnable architecture that can support product modules as they are designed.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- ESLint
- InsForge backend, linked through `.insforge/project.json`
- OpenRouter/OpenAI-compatible SDK setup path
- Resend-ready email layer
- Zod-ready validation layer

## Project Structure

```txt
app/                         Next.js routes, layouts, and route handlers
components/                  Shared React components
components/ui/               Base interface primitives
components/marketplace/      Marketplace-facing UI
components/forms/            Form components
components/dashboard/        Dashboard and operational UI
lib/                         Shared infrastructure helpers
lib/insforge/                InsForge SDK integration boundary
lib/openrouter/              OpenRouter client boundary
lib/ai/                      AI orchestration boundary
lib/auth/                    Auth helpers and policies
lib/email/                   Email provider integration boundary
lib/analytics/               Analytics integration boundary
lib/validation/              Shared schemas and validation helpers
modules/                     Domain modules
types/                       Cross-module TypeScript types
prompts/                     AI prompts and prompt templates
styles/                      Extra style assets beyond app globals
tests/                       Test setup and specs
```

## Setup

```bash
npm install
npx @insforge/cli whoami
npx @insforge/cli current
npm run setup:openrouter
npm run dev
```

The app runs at `http://localhost:3000` by default.

## Environment Setup

Copy the example file and fill in the values for your local machine:

```bash
cp .env.example .env.local
```

For OpenRouter, use the secure local prompt:

```bash
npm run setup:openrouter
```

That command writes `OPENROUTER_API_KEY` to `.env.local`, which is gitignored.

```bash
APP_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# InsForge
NEXT_PUBLIC_INSFORGE_URL=https://s3wd64js.eu-central.insforge.app
NEXT_PUBLIC_INSFORGE_ANON_KEY=
INSFORGE_SERVICE_ROLE_KEY=

# AI / OpenRouter
OPENROUTER_API_KEY=
OPENROUTER_DEFAULT_MODEL=openrouter/free

# Email
RESEND_API_KEY=
EMAIL_FROM=Intelekt Marketplace <hello@example.com>

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Observability
SENTRY_DSN=
```

Environment validation lives in `lib/env.ts` and shared app configuration lives in `lib/config.ts`. Server-only secrets are intentionally available only through server-only modules:

- `INSFORGE_SERVICE_ROLE_KEY`
- `OPENROUTER_API_KEY`
- `RESEND_API_KEY`

Only variables prefixed with `NEXT_PUBLIC_` are safe to expose in browser code. Do not move service role keys, AI keys, or email provider keys into `NEXT_PUBLIC_*` variables.

`OPENROUTER_DEFAULT_MODEL` defaults to `openrouter/free`, OpenRouter's free model router. It automatically selects from currently available free models and filters by request capabilities such as vision, tools, or structured outputs. Use `openrouter/auto` only after explicitly allowing paid model routing.

## Development Commands

```bash
npm run dev      # Start the local dev server
npm run build    # Create a production build
npm run start    # Run the production server
npm run lint     # Run ESLint
```

## Backend

This project is linked to InsForge project `e38bbddf-a668-4dd2-8633-56e46913090d` (`Intelekt marketplace`, `eu-central`). Use the InsForge CLI through `npx` for backend work:

```bash
npx @insforge/cli current
npx @insforge/cli metadata
```
