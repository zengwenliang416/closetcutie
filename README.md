# ClosetCutie 🎀

A smart closet management application powered by AI, built as a modern Monorepo.

## 🏗 Project Structure

This project uses [Turborepo](https://turbo.build/) and [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) to manage multiple applications and shared packages.

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

- Node.js (v18+)
- npm (v9+)

### Installation

```bash
# Install dependencies for all workspaces
npm install
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
npm run dev

# Run specific app
npm run dev --filter=closetcutie-web
npm run dev --filter=closetcutie-uni
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

## 🛠 Building

```bash
# Build all applications
npm run build
```

## 📝 License

MIT
