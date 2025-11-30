# Contributing to ClosetCutie

Thank you for taking the time to improve the project! This document explains how to set up the dev environment, which commands to run, and what conventions we follow.

## 🧱 Prerequisites

- Node.js 18+ (see `.nvmrc`)
- pnpm 9+ (`corepack enable` is recommended)
- A Gemini API key for the proxy service (`.env.local`)

## 🛠 Setup

1. **Install dependencies**
   ```bash
   pnpm install
   ```
2. **Create environment file**
   ```bash
   cp .env.local.example .env.local   # or define GEMINI_API_KEY manually
   ```
3. **Run dev servers**
   ```bash
   pnpm dev                              # run everything via Turborepo
   pnpm --filter closetcutie-web dev     # React web app
   pnpm --filter closetcutie-uni dev:h5  # Uni-App (H5 preview)
   pnpm --filter closetcutie-api start   # API proxy
   ```

## 🔁 Development Flow

1. Create a feature branch from `main`.
2. Implement and keep changes small + focused.
3. Run quality gates locally:
   ```bash
   pnpm lint
   pnpm type-check
   pnpm format:check
   pnpm build          # optional but recommended for larger changes
   ```
4. Commit changes (Husky will run `lint-staged` + commit message check).
5. Open a PR when CI is green.

## 📦 Useful Commands

| Goal                   | Command                              |
| ---------------------- | ------------------------------------ |
| Build everything       | `pnpm build`                         |
| Type check             | `pnpm type-check`                    |
| Lint (web + uni)       | `pnpm lint` / `pnpm lint:fix`        |
| Single app lint        | `pnpm --filter closetcutie-web lint` |
| Format code            | `pnpm format` / `pnpm format:check`  |
| Changeset for releases | `pnpm changeset`                     |

## ✨ Code Style

- ESLint + Prettier enforce formatting; do not bypass them.
- Prefer TypeScript everywhere; avoid `any` unless justified.
- Shared types/services live in `packages/` – reuse before re-implementing.
- Keep React/Vue files small; extract helpers when business logic grows.

## 📝 Commit & PR Guidelines

- Follow [Conventional Commits](https://www.conventionalcommits.org/):
  ```
  feat(web): add outfit search
  fix(api): handle empty payload
  chore: bump dependencies
  ```
- Use descriptive scopes (`web`, `uni`, `api`, `services`, etc.).
- One logical change per commit; keep PRs focused and documented (screenshots/logs when relevant).

## ✅ Before Submitting a PR

- [ ] `pnpm lint`
- [ ] `pnpm format:check`
- [ ] `pnpm type-check`
- [ ] `pnpm build` (for cross-package changes)
- [ ] Add/Update tests or stories if behavior changed
- [ ] Update docs (README / CONTRIBUTING / checklist) when process changes

Happy hacking! 🎀
