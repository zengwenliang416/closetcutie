# ClosetCutie 🎀

A smart closet management application powered by AI, built as a modern Monorepo.

## 🏗 Project Structure

This project uses [Turborepo](https://turbo.build/) and [pnpm workspaces](https://pnpm.io/workspaces) to manage multiple applications and shared packages.

```
closetcutie/
├── apps/
│   ├── web/        # React Web Application (Vite + React Router)
│   ├── uni/        # Cross-platform Mobile App (Uni-App + Vue 3 + Pinia)
│   └── api/        # AI Proxy Service (Node.js)
├── packages/
│   ├── types/      # Shared TypeScript interfaces
│   ├── services/   # Shared business logic and API services
│   └── ui/         # Shared design tokens and assets
├── package.json    # Root configuration
├── turbo.json      # Turborepo pipeline configuration
└── tsconfig.base.json # Shared TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (遵循 `.nvmrc`)
- pnpm 9+（推荐 `corepack enable` 自动管理）

### Installation

```bash
# Install dependencies for all workspaces
pnpm install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Development

You can run all applications simultaneously using Turbo:

```bash
# Run all apps (web, uni, api) in parallel
pnpm dev

# Run specific app
pnpm --filter closetcutie-web dev
pnpm --filter closetcutie-uni dev:h5
pnpm --filter closetcutie-api start
```

## 📱 Applications

### Web App (`apps/web`)

- **Tech Stack**: React 18, Vite, React Router v6, Tailwind CSS
- **Features**: Responsive design, AI clothing identification, local storage management.

### Mobile App (`apps/uni`)

- **Tech Stack**: Uni-App (Vue 3), Pinia, TypeScript
- **Targets**: iOS, Android, WeChat Mini Program, H5
- **Features**:
  - 📸 Camera integration for adding items
  - 🧠 AI-powered categorization
  - 🌊 Waterfall list UI
  - 💾 State persistence with Pinia

### API Service (`apps/api`)

- **Tech Stack**: Node.js
- **Role**: Proxies requests to Gemini AI API to avoid exposing keys on the client.

## 📦 Shared Packages

- **@types**: Common data models (`ClothingItem`, `StorageUnit`, `Category`).
- **@services**: Shared API clients and AI logic.
- **@ui**: Shared design tokens and icons.

## 🛠 Building & Quality

```bash
# Build all applications
pnpm build

# Type checking via Turborepo pipelines
pnpm type-check

# Run lint for every app (web + uni)
pnpm lint

# Auto-fix lint issues
pnpm lint:fix

# Format codebase with Prettier
pnpm format
pnpm format:check
```

### Code Style & Commits

- ESLint / Prettier 配置集中在共享包，所有提交都会触发 Husky 的 `lint-staged` 与 Conventional Commits 校验。
- 提交信息需符合 `type(scope): description`（如 `feat(web): add closet grid`）。详见 [CONTRIBUTING.md](CONTRIBUTING.md)。

### Recommended workflow

1. `pnpm install`
2. `pnpm dev`（或针对性 filter 命令）
3. 变更前运行 `pnpm lint` + `pnpm format:check`
4. 提交会自动运行 `lint-staged`，无需手动执行。

## 🤝 Contributing

欢迎通过 issue / PR 参与贡献，请先阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 了解分支策略、命令合集与提交规范。

## 📝 License

MIT
