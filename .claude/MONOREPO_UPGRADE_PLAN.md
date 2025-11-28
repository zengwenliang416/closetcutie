# ClosetCutie Monorepo 专业化改造方案

> 版本: v1.2 | 创建时间: 2025-01-28 | 状态: 待讨论

---

## 1. 项目现状分析

### 1.1 当前架构

```
closetcutie/
├── apps/
│   ├── api/          # Node.js API 服务 (Gemini AI 代理)
│   ├── uni/          # Uni-App 跨平台应用 (Vue 3 + Pinia)
│   └── web/          # React Web 应用 (React 19 + Vite)
├── packages/
│   ├── types/        # 共享 TypeScript 类型
│   ├── services/     # 共享 AI 服务
│   └── ui/           # 共享设计 tokens 和图标
├── turbo.json        # Turborepo 配置
├── tsconfig.base.json
└── package.json      # npm workspaces 配置 (待迁移到 pnpm)
```

### 1.2 技术栈

| 层级 | 当前 | 改造后 |
|------|------|--------|
| 构建编排 | Turborepo 1.12.4 | Turborepo 2.x |
| 包管理 | npm workspaces | **pnpm workspaces** |
| Web 前端 | React 19 + Vite 6 + React Router 7 | 不变 |
| 移动端 | Uni-App (Vue 3) + Pinia | 不变 |
| API 服务 | Node.js + @google/genai | 不变 |
| 语言 | TypeScript 5.4+ | 不变 |

### 1.3 为什么选择 pnpm

| 特性 | npm | pnpm |
|------|-----|------|
| 磁盘空间 | 每个项目完整安装 | 全局存储 + 硬链接，节省 50%+ |
| 安装速度 | 较慢 | 快 2-3 倍 |
| 依赖隔离 | 扁平化可能导致幽灵依赖 | 严格隔离，杜绝幽灵依赖 |
| Monorepo 支持 | 基础 | 原生优化，workspace 协议更强 |
| 与 Turborepo | 兼容 | 官方推荐组合 |

### 1.4 现状评估

| 评估维度 | 当前状态 | 评分 | 说明 |
|----------|----------|------|------|
| 目录结构 | ✅ 良好 | 8/10 | apps/ + packages/ 分离清晰 |
| 工作空间 | ⚠️ 待迁移 | 6/10 | npm workspaces → pnpm |
| 构建配置 | ⚠️ 待升级 | 5/10 | turbo.json 使用旧版 `pipeline` 格式 |
| TypeScript | ⚠️ 待完善 | 6/10 | 缺少共享配置包，部分包缺少 tsconfig |
| 代码规范 | ❌ 缺失 | 0/10 | 无 ESLint / Prettier |
| Git Hooks | ❌ 缺失 | 0/10 | 无 husky / lint-staged |
| 版本管理 | ❌ 缺失 | 0/10 | 无 Changesets，包版本固定 0.0.0 |
| CI/CD | ❌ 缺失 | 0/10 | 无 GitHub Actions |
| 文档 | ⚠️ 基础 | 5/10 | 有 README，缺少贡献指南 |

### 1.5 已发现的问题

1. **turbo.json 配置过时**: 使用 `pipeline` 而非新版 `tasks`
2. **遗留空目录**: 根目录存在空的 `src/`, `components/`, `services/`
3. **packages/services 缺少 tsconfig.json**
4. **packages/ui 导出不完整**: 缺少 package.json 的 main/types 字段
5. **无代码质量保障**: 缺少 lint、format、pre-commit 检查
6. **npm 效率问题**: 安装慢、磁盘占用大

---

## 2. 改造目标

### 2.1 核心原则

| 原则 | 说明 |
|------|------|
| **UI 不变** | 不修改任何组件、样式、业务逻辑代码 |
| **渐进式** | 每阶段可独立完成、验证、回滚 |
| **标准化** | 遵循 Turborepo + pnpm 官方最佳实践 |
| **双框架兼容** | ESLint/TypeScript 同时支持 React 和 Vue |

### 2.2 改造范围

| 范围 | 包含 | 不包含 |
|------|------|--------|
| 包管理器 | npm → pnpm 迁移 | - |
| 工程配置 | turbo.json, tsconfig, package.json | - |
| 代码质量 | ESLint, Prettier, husky | - |
| 版本管理 | Changesets | - |
| CI/CD | GitHub Actions | - |
| 业务代码 | - | apps/*, packages/services, packages/types |
| UI/样式 | - | packages/ui/tokens.css, 所有组件样式 |

---

## 3. 改造方案详情

### 阶段 0: 迁移到 pnpm (新增)

**目标**: 从 npm 迁移到 pnpm 作为包管理器

#### 0.1 安装 pnpm

```bash
# 全局安装 pnpm
npm install -g pnpm

# 或使用 corepack (Node.js 16.13+)
corepack enable
corepack prepare pnpm@latest --activate
```

#### 0.2 创建 pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

#### 0.3 更新根目录 package.json

```json
{
  "name": "closetcutie-monorepo",
  "private": true,
  "packageManager": "pnpm@9.15.0",
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "clean": "rm -rf node_modules **/node_modules .turbo",
    "web:dev": "pnpm --filter closetcutie-web dev",
    "uni:dev": "pnpm --filter closetcutie-uni dev:h5",
    "api:dev": "pnpm --filter closetcutie-api start"
  },
  "devDependencies": {
    "turbo": "^2.3.0",
    "typescript": "^5.4.2"
  }
}
```

**注意**: 移除 `"workspaces"` 字段，pnpm 使用 `pnpm-workspace.yaml`

#### 0.4 更新子包依赖引用

使用 pnpm workspace 协议:

**apps/web/package.json**:
```json
{
  "dependencies": {
    "@closetcutie/services": "workspace:*",
    "@closetcutie/types": "workspace:*",
    "@closetcutie/ui": "workspace:*"
  }
}
```

**packages/services/package.json**:
```json
{
  "dependencies": {
    "@closetcutie/types": "workspace:*"
  }
}
```

#### 0.5 迁移步骤

```bash
# 1. 删除现有 node_modules 和 lock 文件
rm -rf node_modules **/node_modules package-lock.json

# 2. 安装依赖
pnpm install

# 3. 验证
pnpm run dev
```

#### 0.6 添加 .npmrc

```ini
# pnpm 配置
shamefully-hoist=true
strict-peer-dependencies=false
auto-install-peers=true
```

**说明**:
- `shamefully-hoist=true`: 兼容某些不规范的包 (如 Uni-App)
- `strict-peer-dependencies=false`: 放宽 peer 依赖检查
- `auto-install-peers=true`: 自动安装 peer 依赖

#### 0.7 前端架构注意事项

- 在 CI/CD 中配合 `pnpm fetch` 预热依赖，再执行 `pnpm install --offline`，确保 Turborepo 任务能稳定命中缓存并缩短 Vite/Web/Uni 多框架安装耗时。
- apps/web 与 apps/uni 的 Vite/Uni-App 插件版本需要通过 `workspace:*` 对齐，避免 lockfile 中出现多份相同打包插件导致 dev server 行为不一致。
- 若某些三方库仍依赖 npm 的扁平结构，可通过 `pnpmfile.cjs` 定制 alias 或 patch，而不是永久开启 `shamefully-hoist`，以免破坏 workspace 隔离。该文件需在方案中明确位置和维护人。

#### 0.8 添加 pnpmfile.cjs (可选)

当需要对特定依赖进行 hook 处理时，在根目录创建 `pnpmfile.cjs`：

```javascript
// pnpmfile.cjs
// 维护人: [待指定]
// 用途: 处理不兼容 pnpm 严格模式的第三方依赖

module.exports = {
  hooks: {
    readPackage(pkg, context) {
      // 示例: 修复某些包的 peer 依赖声明
      // if (pkg.name === 'some-problematic-package') {
      //   pkg.dependencies = {
      //     ...pkg.dependencies,
      //     'missing-peer': '^1.0.0'
      //   };
      // }
      return pkg;
    }
  }
};
```

**说明**:
- 优先使用 `pnpmfile.cjs` 处理兼容性问题，而非永久开启 `shamefully-hoist`
- 每次添加 hook 需在文件中注释说明原因和预期移除时间
- 定期检查是否可以移除 workaround (依赖升级后)

---

### 阶段 1: 基础设施升级

**目标**: 升级 Turborepo 配置，添加编辑器统一配置

#### 1.1 升级 turbo.json

**当前配置** (旧版 pipeline 格式):
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "dev": { "cache": false, "persistent": true },
    "lint": { "outputs": [] },
    "check-types": { "outputs": [] }
  }
}
```

**升级后** (新版 tasks 格式):
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".output/**"],
      "inputs": ["src/**", "package.json", "tsconfig.json"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "lint:web": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "lint:uni": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "lint:fix": {
      "cache": false
    },
    "format": {
      "cache": false
    },
    "format:check": {
      "outputs": []
    },
    "type-check": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"],
      "inputs": ["src/**", "tests/**", "**/*.test.ts", "**/*.spec.ts"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

> 💡 **分离 Lint 任务说明**: `lint:web` 和 `lint:uni` 允许在 CI 中并行执行 React 和 Vue 的 lint 检查，避免串行执行两套配置导致的耗时问题。各应用在自己的 package.json 中定义对应脚本。

#### 1.2 添加 .nvmrc

```
18
```

#### 1.3 添加 .editorconfig

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
indent_size = 2
indent_style = space
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false

[*.{yml,yaml}]
indent_size = 2

[Makefile]
indent_style = tab
```

#### 1.4 清理遗留空目录

删除以下空目录:
- `src/shared/`
- `src/styles/`
- `src/`
- `components/`
- `services/`

---

### 阶段 2: 共享配置包

**目标**: 创建可复用的 TypeScript 和 ESLint 配置包

#### 2.1 创建 packages/tsconfig

```
packages/tsconfig/
├── package.json
├── base.json          # 基础配置
├── react.json         # React 应用配置
├── vue.json           # Vue 应用配置
└── node.json          # Node.js 服务配置
```

**package.json**:
```json
{
  "name": "@closetcutie/tsconfig",
  "version": "0.0.0",
  "private": true,
  "files": ["*.json"],
  "exports": {
    "./base.json": "./base.json",
    "./react.json": "./react.json",
    "./vue.json": "./vue.json",
    "./node.json": "./node.json"
  }
}
```

**base.json**:
```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true
  }
}
```

**react.json**:
```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "noEmit": true
  }
}
```

**vue.json**:
```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "noEmit": true
  }
}
```

**node.json**:
```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "noEmit": true
  }
}
```

#### 2.2 创建 packages/eslint-config

```
packages/eslint-config/
├── package.json
├── index.js           # 基础配置
├── react.js           # React 配置
└── vue.js             # Vue 配置
```

**package.json**:
```json
{
  "name": "@closetcutie/eslint-config",
  "version": "0.0.0",
  "private": true,
  "main": "index.js",
  "exports": {
    ".": "./index.js",
    "./react": "./react.js",
    "./vue": "./vue.js"
  },
  "dependencies": {
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-import": "^2.29.0",
    "eslint-plugin-react": "^7.34.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-vue": "^9.22.0",
    "eslint-plugin-vuejs-accessibility": "^2.2.1"
  },
  "peerDependencies": {
    "eslint": "^8.0.0 || ^9.0.0"
  }
}
```

> 💡 React/Vue 共存时需要独立的 lint preset。建议在 `packages/eslint-config/react.js` 中默认开启 React Hooks/JSX runtime 校验，并在 `vue.js` 中补充 `<script setup>` + `<template>` 的 parser 配置；否则 apps/uni 将无法复用统一 lint 规则。

#### 2.3 ESLint 配置文件详情

**packages/eslint-config/index.js** (基础配置):
```javascript
// 基础 ESLint 配置 - TypeScript 项目通用
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier', // 必须放最后，关闭与 Prettier 冲突的规则
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc' },
      },
    ],
  },
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
};
```

**packages/eslint-config/react.js** (React 配置):
```javascript
// React 专用 ESLint 配置
module.exports = {
  extends: [
    './index.js',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime', // React 17+ 新 JSX transform
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  plugins: ['react', 'react-hooks'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/prop-types': 'off', // 使用 TypeScript 类型
    'react/react-in-jsx-scope': 'off', // React 17+ 不需要
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
```

**packages/eslint-config/vue.js** (Vue 配置):
```javascript
// Vue 3 专用 ESLint 配置
module.exports = {
  extends: [
    './index.js',
    'plugin:vue/vue3-recommended',
    'plugin:vuejs-accessibility/recommended',
    'prettier',
  ],
  plugins: ['vue', 'vuejs-accessibility'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
    extraFileExtensions: ['.vue'],
  },
  rules: {
    'vue/multi-word-component-names': 'off', // 允许单词组件名 (如 index.vue)
    'vue/no-v-html': 'warn',
    'vue/component-tags-order': ['error', { order: ['script', 'template', 'style'] }],
    'vue/define-macros-order': ['error', { order: ['defineProps', 'defineEmits'] }],
    'vue/block-lang': ['error', { script: { lang: 'ts' } }],
  },
};
```

---

### 阶段 3: 代码质量工具链

**目标**: 配置 ESLint、Prettier、Git Hooks

#### 3.1 根目录 package.json 更新

新增 devDependencies:
```json
{
  "devDependencies": {
    "eslint": "^8.57.0",
    "prettier": "^3.2.0",
    "husky": "^9.0.0",
    "lint-staged": "^15.2.0",
    "@closetcutie/eslint-config": "workspace:*"
  }
}
```

新增 scripts:
```json
{
  "scripts": {
    "lint": "turbo run lint",
    "lint:fix": "turbo run lint:fix",
    "format": "prettier --write \"**/*.{ts,tsx,vue,js,jsx,json,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,vue,js,jsx,json,md}\"",
    "type-check": "turbo run type-check",
    "prepare": "husky"
  }
}
```

#### 3.2 添加 .prettierrc

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

#### 3.3 添加 .prettierignore

```
node_modules
dist
.output
.turbo
coverage
*.min.js
pnpm-lock.yaml
```

#### 3.4 配置 husky

**.husky/pre-commit**:
```bash
#!/bin/sh
pnpm lint-staged
```

**.husky/commit-msg**:
```bash
#!/bin/sh
# 可选: 添加 commitlint 检查
```

#### 3.5 配置 lint-staged

在 package.json 中添加:
```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.vue": ["eslint --fix", "prettier --write"],
    "*.{json,md,yml,yaml}": ["prettier --write"]
  }
}
```

#### 3.6 各应用 ESLint 配置

**apps/web/.eslintrc.js** (React 应用):
```javascript
module.exports = {
  root: true,
  extends: ['@closetcutie/eslint-config/react'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['dist', 'node_modules', 'vite.config.ts'],
};
```

**apps/web/package.json** 添加脚本:
```json
{
  "scripts": {
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix"
  }
}
```

**apps/uni/.eslintrc.js** (Vue 应用):
```javascript
module.exports = {
  root: true,
  extends: ['@closetcutie/eslint-config/vue'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['dist', 'node_modules', '.output', 'vite.config.ts'],
  globals: {
    uni: 'readonly',
    wx: 'readonly',
    plus: 'readonly',
  },
};
```

**apps/uni/package.json** 添加脚本:
```json
{
  "scripts": {
    "lint": "eslint src --ext .ts,.vue",
    "lint:fix": "eslint src --ext .ts,.vue --fix"
  }
}
```

---

### 阶段 4: 完善现有 packages

**目标**: 优化现有共享包的配置和导出

#### 4.1 packages/ui 优化

**更新 package.json**:
```json
{
  "name": "@closetcutie/ui",
  "version": "0.0.0",
  "private": true,
  "sideEffects": ["*.css"],
  "exports": {
    "./tokens.css": "./tokens.css",
    "./icons/*": "./icons/*"
  },
  "files": ["tokens.css", "icons"]
}
```

#### 4.2 packages/types 优化

**更新 package.json**:
```json
{
  "name": "@closetcutie/types",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsc",
    "type-check": "tsc --noEmit"
  }
}
```

#### 4.3 packages/services 优化

**添加 tsconfig.json**:
```json
{
  "extends": "@closetcutie/tsconfig/node.json",
  "compilerOptions": {
    "baseUrl": ".",
    "outDir": "./dist",
    "rootDir": "."
  },
  "include": ["./**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

**更新 package.json**:
```json
{
  "name": "@closetcutie/services",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./dist/ai.js",
  "types": "./dist/ai.d.ts",
  "exports": {
    ".": {
      "types": "./dist/ai.d.ts",
      "import": "./dist/ai.js"
    }
  },
  "scripts": {
    "build": "tsc",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@google/genai": "^1.30.0",
    "@closetcutie/types": "workspace:*"
  }
}
```

---

### 阶段 5: 版本管理 (Changesets)

**目标**: 引入 Changesets 进行语义化版本管理

#### 5.1 添加 .changeset/config.json

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "restricted",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

#### 5.2 更新 package.json scripts

```json
{
  "scripts": {
    "changeset": "changeset",
    "version": "changeset version",
    "release": "turbo run build && changeset publish"
  },
  "devDependencies": {
    "@changesets/cli": "^2.27.0"
  }
}
```

---

### 阶段 6: CI/CD (GitHub Actions)

**目标**: 自动化 PR 检查和发布流程

#### 6.1 添加 .github/workflows/ci.yml

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
  TURBO_TEAM: ${{ vars.TURBO_TEAM }}

jobs:
  # 格式检查 - 快速失败
  format:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'pnpm'

      - name: Fetch dependencies
        run: pnpm fetch

      - name: Install dependencies (offline)
        run: pnpm install --offline --frozen-lockfile

      - name: Check formatting
        run: pnpm run format:check

  # Lint - React 和 Vue 并行执行
  lint:
    runs-on: ubuntu-latest
    needs: format
    strategy:
      matrix:
        target: [web, uni]
    steps:
      - uses: actions/checkout@v4

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'pnpm'

      - name: Fetch dependencies
        run: pnpm fetch

      - name: Install dependencies (offline)
        run: pnpm install --offline --frozen-lockfile

      - name: Lint ${{ matrix.target }}
        run: pnpm --filter closetcutie-${{ matrix.target }} lint

  # 类型检查和构建
  build:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'pnpm'

      - name: Fetch dependencies
        run: pnpm fetch

      - name: Install dependencies (offline)
        run: pnpm install --offline --frozen-lockfile

      - name: Type check
        run: pnpm run type-check

      - name: Build
        run: pnpm run build
```

> 💡 **CI 优化说明**:
> - 使用 `pnpm fetch` + `pnpm install --offline` 预热缓存，加速安装
> - Lint 任务使用 matrix 并行执行 web 和 uni，避免串行等待
> - 格式检查作为独立 job 快速失败，节省后续资源

#### 6.2 添加 .github/workflows/release.yml (可选)

```yaml
name: Release

on:
  push:
    branches: [main]

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  release:
    runs-on: ubuntu-latest
    if: github.repository == 'your-org/closetcutie'

    steps:
      - uses: actions/checkout@v4

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Create Release Pull Request
        uses: changesets/action@v1
        with:
          version: pnpm run version
          publish: pnpm run release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

### 阶段 7: 文档完善

**目标**: 补充开发文档和贡献指南

#### 7.1 更新 README.md

补充以下章节:
- 开发环境要求 (pnpm 9+)
- 代码规范说明
- 提交规范
- 发布流程

#### 7.2 添加 CONTRIBUTING.md

```markdown
# 贡献指南

## 环境要求

- Node.js 18+
- pnpm 9+

## 开发流程

1. Fork 并 clone 仓库
2. 安装依赖: `pnpm install`
3. 创建功能分支: `git checkout -b feature/xxx`
4. 开发并提交
5. 创建 Pull Request

## 常用命令

```bash
# 安装依赖
pnpm install

# 启动所有应用
pnpm dev

# 启动特定应用
pnpm --filter closetcutie-web dev
pnpm --filter closetcutie-uni dev:h5

# 构建
pnpm build

# 代码检查
pnpm lint
pnpm format
pnpm type-check
```

## 提交规范

使用 Conventional Commits 格式:
- `feat: 新功能`
- `fix: 修复 bug`
- `docs: 文档更新`
- `style: 代码格式`
- `refactor: 重构`
- `test: 测试`
- `chore: 构建/工具`

## 代码规范

- 提交前会自动运行 lint 和 format
- 确保 `pnpm type-check` 通过
- 确保 `pnpm build` 成功
```

---

## 4. 最终目录结构

```
closetcutie/
├── .changeset/                 # [新增] 版本管理
│   └── config.json
├── .github/                    # [新增] CI/CD
│   └── workflows/
│       ├── ci.yml
│       └── release.yml
├── .husky/                     # [新增] Git hooks
│   ├── pre-commit
│   └── commit-msg
├── apps/
│   ├── api/                    # [不变] API 服务
│   ├── uni/                    # [不变] Uni-App
│   └── web/                    # [不变] React Web
├── packages/
│   ├── eslint-config/          # [新增] ESLint 配置包
│   ├── tsconfig/               # [新增] TypeScript 配置包
│   ├── types/                  # [优化] 类型定义
│   ├── services/               # [优化] 业务服务
│   └── ui/                     # [优化] UI 资源
├── .editorconfig               # [新增]
├── .eslintrc.js                # [新增]
├── .npmrc                      # [新增] pnpm 配置
├── .nvmrc                      # [新增]
├── .prettierrc                 # [新增]
├── .prettierignore             # [新增]
├── CONTRIBUTING.md             # [新增]
├── package.json                # [升级] 移除 workspaces，添加 packageManager
├── pnpm-workspace.yaml         # [新增] pnpm 工作空间配置
├── pnpmfile.cjs                # [可选] 依赖 hook 处理
├── turbo.json                  # [升级]
└── tsconfig.base.json          # [优化]
```

---

## 5. 实施计划

| 阶段 | 内容 | 风险级别 | 可回滚 |
|------|------|----------|--------|
| 0 | **pnpm 迁移** | 中 | ✅ |
| 1 | 基础设施升级 | 低 | ✅ |
| 2 | 共享配置包 | 低 | ✅ |
| 3 | 代码质量工具 | 中 | ✅ |
| 4 | 完善 packages | 低 | ✅ |
| 5 | 版本管理 | 低 | ✅ |
| 6 | CI/CD | 低 | ✅ |
| 7 | 文档完善 | 低 | ✅ |

---

## 6. 待讨论事项（决策结论）

### 6.1 包命名规范（采用 scope）

- **决策**: 所有 workspace 包统一升级为 `@closetcutie/*`，包括 apps 所依赖的 shared 包与配置包。
- **执行要点**:
  - 使用 `pnpm pkg set name=@closetcutie/<pkg>` 批量更新 `packages/*`、`apps/*` 的 `package.json`。
  - 通过 `pnpm dlx tsx ./scripts/update-imports.ts`（或手动脚本）修正代码里的旧命名引用。
  - 在需要发布的包中补充 `publishConfig.access`，确保 scope 包默认私有。

### 6.2 commitlint（强制实施）

- **决策**: 引入 commitlint 并与 husky 联动，强制执行 Conventional Commits，给 Changesets/CI 可靠的语义输入。
- **执行要点**:
  - 安装 `@commitlint/{cli,config-conventional}`，创建 `commitlint.config.cjs`。
  - 更新 `.husky/commit-msg` 运行 `pnpm commitlint --edit $1`。
  - 在 CONTRIBUTING 中补充失败示例，降低团队落地成本。

### 6.3 测试框架（阶段性延后）

- **决策**: 当前迭代聚焦工程基础与质量门槛，不在阶段 0-4 内引入测试框架，但锁定下一里程碑（阶段 8）优先补齐 Vitest + Playwright baseline。
- **补偿措施**:
  - 先在 turbo `tasks` 预留 `test:web` 与 `test:uni`，保持命令通路一致。
  - 在 backlog 中创建 issue，明确责任人和期望交付时间（如 2025-Q2）。

### 6.4 CI/CD 目标环境（统一 GitHub Actions）

- **决策**: 以 GitHub Actions 为唯一支持环境（CI + Release），GitLab 流程不再维护；如需额外平台，通过复用同一 pnpm/turbo pipeline 派生。
- **执行要点**:
  - CI workflows 中引用 `TURBO_TEAM`、`TURBO_TOKEN`，并在组织级变量中管理。
  - 只保留 `.github/workflows/*`，文档里删除 GitLab 用法，避免团队误解。

### 6.5 Renovate/Dependabot（启用 Renovate）

- **决策**: 启用 Renovate（bot 账号）作为依赖升级管理工具，周一 02:00 UTC 批量创建 PR，减少手动维护。
- **执行要点**:
  - 添加 `renovate.json`，限制 `pnpm-lock.yaml`、`package.json` 的 PR 均通过 Changesets。
  - 设定 `automerge=false`、`dependencyDashboard=true`，由前端团队每周合并并触发 Changeset。

### 6.6 pnpm 版本锁定（corepack + packageManager）

- **决策**: 所有开发者/CI 使用 corepack，依赖 `packageManager: \"pnpm@9.15.0\"` 字段锁定版本；CI 中拒绝自动升级。
- **执行要点**:
  - 在 README/CONTRIBUTING 中写明 `corepack enable && corepack prepare pnpm@9.15.0 --activate`。
  - CI job 增加版本校验脚本（`pnpm --version` 与 packageManager 对比），防止漂移。

### 6.7 多框架构建与 UI 包节奏（拆分执行）

- **Lint/Type Check**: 在 turbo.json 中新增 `lint:web`、`lint:uni`、`type-check:web`、`type-check:uni`，CI matrix 并行执行；root `lint`/`type-check` 仅作为聚合命令。
- **UI 发布**: `@closetcutie/ui` tokens/icons 任一改动必须创建独立 Changeset，发布后 apps 通过 `pnpm up @closetcutie/ui --latest` 同步；Storybook（web）与 Uni H5 需各自截图确认。
- **测试前置钩子**: Turbo `test` 任务立即创建但允许 `optionalDependencies`，确保未来接入 Vitest/Playwright 时无需再改 pipeline。

---

## 7. 变更记录

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v1.0 | 2025-01-28 | 初始方案 |
| v1.1 | 2025-01-28 | 包管理器从 npm 改为 pnpm |
| v1.2 | 2025-01-28 | 补充 ESLint 配置详情、分离 lint 任务、CI 优化、pnpmfile.cjs |

---

## 8. 附录

### A. 参考资料

- [Turborepo 官方文档](https://turbo.build/repo/docs)
- [pnpm 官方文档](https://pnpm.io/)
- [pnpm + Turborepo 最佳实践](https://turbo.build/repo/docs/guides/tools/pnpm)
- [Changesets 文档](https://github.com/changesets/changesets)

### B. 相关命令速查

```bash
# pnpm 基础
pnpm install                    # 安装所有依赖
pnpm add <pkg>                  # 添加依赖到当前包
pnpm add -D <pkg>               # 添加开发依赖
pnpm add <pkg> -w               # 添加到根目录
pnpm add <pkg> --filter <name>  # 添加到指定包

# 开发
pnpm dev                        # 启动所有应用
pnpm --filter closetcutie-web dev    # 仅启动 Web
pnpm --filter closetcutie-uni dev:h5 # 仅启动 Uni-App H5

# 构建
pnpm build                      # 构建所有

# 代码质量
pnpm lint                       # 检查代码规范
pnpm lint:fix                   # 自动修复
pnpm format                     # 格式化代码
pnpm type-check                 # 类型检查

# 版本管理
pnpm changeset                  # 创建变更集
pnpm version                    # 更新版本
pnpm release                    # 发布

# 清理
pnpm clean                      # 清理 node_modules 和缓存
```

### C. pnpm vs npm 命令对照

| 操作 | npm | pnpm |
|------|-----|------|
| 安装依赖 | `npm install` | `pnpm install` |
| 添加依赖 | `npm install <pkg>` | `pnpm add <pkg>` |
| 移除依赖 | `npm uninstall <pkg>` | `pnpm remove <pkg>` |
| 运行脚本 | `npm run <script>` | `pnpm <script>` 或 `pnpm run <script>` |
| 工作空间过滤 | `npm --prefix <path>` | `pnpm --filter <name>` |
| 全局安装 | `npm install -g` | `pnpm add -g` |
| 锁文件 | `package-lock.json` | `pnpm-lock.yaml` |
