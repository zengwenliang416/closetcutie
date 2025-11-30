# ClosetCutie Monorepo 改造工作计划

> 基于 MONOREPO_UPGRADE_PLAN.md v1.2 | 创建时间: 2025-01-28

---

## 使用说明

- **状态标记**: `[ ]` 待完成 | `[x]` 已完成 | `[-]` 跳过
- **完成后**: 在任务后添加完成日期和执行人，如 `[x] 任务描述 - @developer 2025-01-29`
- **遇到问题**: 在任务下方添加 `> ⚠️ 问题描述` 记录

---

## 阶段 0: pnpm 迁移

**预计耗时**: 1-2 小时
**风险级别**: 中
**前置条件**: 无

### 任务清单

- [x] **0.1** 全局安装 pnpm - @codex 2025-11-28

  ```bash
  corepack enable
  corepack prepare pnpm@9.15.0 --activate
  ```

- [x] **0.2** 创建 `pnpm-workspace.yaml` - @codex 2025-11-28

  ```yaml
  packages:
    - 'apps/*'
    - 'packages/*'
  ```

- [x] **0.3** 创建 `.npmrc` - @codex 2025-11-28

  ```ini
  shamefully-hoist=true
  strict-peer-dependencies=false
  auto-install-peers=true
  ```

- [x] **0.4** 更新根目录 `package.json` - @codex 2025-11-28
  - [x] 移除 `workspaces` 字段 - @codex 2025-11-28
  - [x] 添加 `"packageManager": "pnpm@9.15.0"` - @codex 2025-11-28
  - [x] 更新脚本为 pnpm 命令 - @codex 2025-11-28

- [x] **0.5** 更新 `apps/web/package.json` 依赖 - @codex 2025-11-28
  - [x] `closetcutie-services` → `@closetcutie/services: "workspace:*"` - @codex 2025-11-28
  - [x] `closetcutie-types` → `@closetcutie/types: "workspace:*"` - @codex 2025-11-28
  - [x] `closetcutie-ui` → `@closetcutie/ui: "workspace:*"` - @codex 2025-11-28

- [x] **0.6** 更新 `apps/uni/package.json` 依赖 - @codex 2025-11-28
  - [x] `closetcutie-services` → `@closetcutie/services: "workspace:*"` - @codex 2025-11-28
  - [x] `closetcutie-types` → `@closetcutie/types: "workspace:*"` - @codex 2025-11-28

- [x] **0.7** 更新 `packages/services/package.json` 依赖 - @codex 2025-11-28
  - [x] `closetcutie-types` → `@closetcutie/types: "workspace:*"` - @codex 2025-11-28

- [x] **0.8** 重命名包 (配合 0.5-0.7) - @codex 2025-11-28
  - [x] `packages/types/package.json` name → `@closetcutie/types` - @codex 2025-11-28
  - [x] `packages/services/package.json` name → `@closetcutie/services` - @codex 2025-11-28
  - [x] `packages/ui/package.json` name → `@closetcutie/ui` - @codex 2025-11-28

- [x] **0.9** 清理旧依赖 - @codex 2025-11-28

  ```bash
  rm -rf node_modules **/node_modules package-lock.json
  ```

- [x] **0.10** 安装依赖并验证 - @codex 2025-11-28

  ```bash
  pnpm install
  pnpm run dev  # 验证所有应用可正常启动
  ```

- [ ] **0.11** (可选) 创建 `pnpmfile.cjs` - 如遇兼容性问题

### 阶段 0 验收标准

- [x] `pnpm install` 成功执行 - @codex 2025-11-28
- [x] `pnpm run dev` 所有应用正常启动 - @codex 2025-11-28
- [x] `pnpm-lock.yaml` 生成 - @codex 2025-11-28
- [x] 无 `package-lock.json` 残留 - @codex 2025-11-28

---

## 阶段 1: 基础设施升级

**预计耗时**: 30 分钟
**风险级别**: 低
**前置条件**: 阶段 0 完成

### 任务清单

- [x] **1.1** 升级 `turbo.json` 到新版 tasks 格式 - @codex 2025-11-28
  - [x] 将 `pipeline` 改为 `tasks` - @codex 2025-11-28
  - [x] 添加 `lint:web`, `lint:uni` 分离任务 - @codex 2025-11-28
  - [x] 添加 `format`, `format:check` 任务 - @codex 2025-11-28
  - [x] 添加 `inputs` 配置优化缓存 - @codex 2025-11-28

- [x] **1.2** 升级 turbo 版本 - @codex 2025-11-28

  ```bash
  pnpm add -Dw turbo@^2.3.0
  ```

- [x] **1.3** 创建 `.nvmrc` - @codex 2025-11-28

  ```
  18
  ```

- [x] **1.4** 创建 `.editorconfig` - @codex 2025-11-28

- [x] **1.5** 清理遗留空目录 - @codex 2025-11-28
  ```bash
  rm -rf src/ components/ services/  # 根目录下的空目录
  ```

### 阶段 1 验收标准

- [x] `pnpm turbo run build` 成功 - @codex 2025-11-28
- [x] turbo.json 使用 `tasks` 而非 `pipeline` - @codex 2025-11-28
- [x] 遗留空目录已删除 - @codex 2025-11-28

---

## 阶段 2: 共享配置包

**预计耗时**: 1-2 小时
**风险级别**: 低
**前置条件**: 阶段 1 完成

### 任务清单

#### 2.1 创建 TypeScript 配置包

- [x] **2.1.1** 创建 `packages/tsconfig/` 目录 - @codex 2025-11-28
- [x] **2.1.2** 创建 `packages/tsconfig/package.json` - @codex 2025-11-28
- [x] **2.1.3** 创建 `packages/tsconfig/base.json` - @codex 2025-11-28
- [x] **2.1.4** 创建 `packages/tsconfig/react.json` - @codex 2025-11-28
- [x] **2.1.5** 创建 `packages/tsconfig/vue.json` - @codex 2025-11-28
- [x] **2.1.6** 创建 `packages/tsconfig/node.json` - @codex 2025-11-28

#### 2.2 创建 ESLint 配置包

- [x] **2.2.1** 创建 `packages/eslint-config/` 目录 - @codex 2025-11-28
- [x] **2.2.2** 创建 `packages/eslint-config/package.json` - @codex 2025-11-28
- [x] **2.2.3** 创建 `packages/eslint-config/index.js` (基础配置) - @codex 2025-11-28
- [x] **2.2.4** 创建 `packages/eslint-config/react.js` - @codex 2025-11-28
- [x] **2.2.5** 创建 `packages/eslint-config/vue.js` - @codex 2025-11-28

#### 2.3 安装配置包依赖

- [x] **2.3.1** 安装 ESLint 相关依赖到 `packages/eslint-config` - @codex 2025-11-28
  ```bash
  pnpm --filter @closetcutie/eslint-config add \
    @typescript-eslint/eslint-plugin \
    @typescript-eslint/parser \
    eslint-config-prettier \
    eslint-plugin-import \
    eslint-plugin-react \
    eslint-plugin-react-hooks \
    eslint-plugin-vue \
    eslint-plugin-vuejs-accessibility
  ```

#### 2.4 更新现有 tsconfig 引用

- [x] **2.4.1** 更新 `apps/web/tsconfig.json` 使用 `@closetcutie/tsconfig/react.json` - @codex 2025-11-28
- [x] **2.4.2** 更新 `apps/uni/tsconfig.json` 使用 `@closetcutie/tsconfig/vue.json` - @codex 2025-11-28
- [x] **2.4.3** 更新 `apps/api/tsconfig.json` 使用 `@closetcutie/tsconfig/node.json` - @codex 2025-11-28
- [x] **2.4.4** 更新 `packages/types/tsconfig.json` - @codex 2025-11-28
- [x] **2.4.5** 更新 `packages/services/tsconfig.json` - @codex 2025-11-28

### 阶段 2 验收标准

- [x] `packages/tsconfig` 和 `packages/eslint-config` 目录存在 - @codex 2025-11-28
- [x] `pnpm install` 成功 - @codex 2025-11-28
- [x] TypeScript 编译正常 (`pnpm type-check`) - @codex 2025-11-28

---

## 阶段 3: 代码质量工具链

**预计耗时**: 1-2 小时
**风险级别**: 中
**前置条件**: 阶段 2 完成

### 任务清单

#### 3.1 安装根目录工具

- [x] **3.1.1** 安装 ESLint - @codex 2025-11-28
  ```bash
  pnpm add -Dw eslint@^8.57.0
  ```
- [x] **3.1.2** 安装 Prettier - @codex 2025-11-28
  ```bash
  pnpm add -Dw prettier@^3.2.0
  ```
- [x] **3.1.3** 安装 husky - @codex 2025-11-28
  ```bash
  pnpm add -Dw husky@^9.0.0
  ```
- [x] **3.1.4** 安装 lint-staged - @codex 2025-11-28
  ```bash
  pnpm add -Dw lint-staged@^15.2.0
  ```

#### 3.2 配置文件

- [x] **3.2.1** 创建 `.prettierrc` - @codex 2025-11-30（已存在并复核）
- [x] **3.2.2** 创建 `.prettierignore` - @codex 2025-11-30（已存在并复核）
- [x] **3.2.3** 初始化 husky - @codex 2025-11-30（已存在并复核）
  ```bash
  pnpm exec husky init
  ```
- [x] **3.2.4** 创建 `.husky/pre-commit` - @codex 2025-11-30（已存在并复核）
- [ ] **3.2.5** (可选) 创建 `.husky/commit-msg`

#### 3.3 配置 lint-staged

- [x] **3.3.1** 在根 `package.json` 添加 `lint-staged` 配置 - @codex 2025-11-30（已存在并复核）

#### 3.4 应用级 ESLint 配置

- [x] **3.4.1** 创建 `apps/web/.eslintrc.js`（按需使用 .cjs 以兼容 type:module）- @codex 2025-11-30
- [x] **3.4.2** 在 `apps/web/package.json` 添加 lint 脚本 - @codex 2025-11-30（已存在并复核）
- [x] **3.4.3** 创建 `apps/uni/.eslintrc.js` - @codex 2025-11-30
- [x] **3.4.4** 在 `apps/uni/package.json` 添加 lint 脚本 - @codex 2025-11-30（已存在并复核）
- [x] **3.4.5** (可选) 创建 `apps/api/.eslintrc.js` - @codex 2025-11-30

#### 3.5 更新根 package.json 脚本

- [x] **3.5.1** 添加 `lint`, `lint:fix`, `format`, `format:check` 脚本 - @codex 2025-11-30（已存在并复核）
- [x] **3.5.2** 添加 `prepare` 脚本 (husky) - @codex 2025-11-30（已存在并复核）

### 阶段 3 验收标准

- [x] `pnpm lint` 可执行 (可能有警告/错误，但命令本身成功) - @codex 2025-11-30（存在 import 排序 warning，命令成功）
- [x] `pnpm format` 可执行 - @codex 2025-11-30
- [ ] Git commit 时触发 pre-commit hook
- [ ] lint-staged 正常工作

---

## 阶段 4: 完善现有 packages

**预计耗时**: 1 小时
**风险级别**: 低
**前置条件**: 阶段 3 完成

### 任务清单

#### 4.1 优化 packages/ui

- [x] **4.1.1** 更新 `packages/ui/package.json` - @codex 2025-11-30
  - [x] 添加 `sideEffects: ["*.css"]` - @codex 2025-11-30
  - [x] 添加完整的 `exports` 字段 - @codex 2025-11-30
  - [x] 添加 `files` 字段 - @codex 2025-11-30

#### 4.2 优化 packages/types

- [x] **4.2.1** 更新 `packages/types/package.json` - @codex 2025-11-30
  - [x] 添加 `type: "module"` - @codex 2025-11-30
  - [x] 添加 `main`, `types`, `exports` 字段 - @codex 2025-11-30
  - [x] 添加 `build`, `type-check` 脚本 - @codex 2025-11-30
- [x] **4.2.2** 确保 tsconfig.json 正确配置 - @codex 2025-11-30

#### 4.3 优化 packages/services

- [x] **4.3.1** 创建/更新 `packages/services/tsconfig.json` - @codex 2025-11-30
- [x] **4.3.2** 更新 `packages/services/package.json` - @codex 2025-11-30
  - [x] 添加 `type: "module"` - @codex 2025-11-30
  - [x] 添加 `main`, `types`, `exports` 字段 - @codex 2025-11-30
  - [x] 添加 `build`, `type-check` 脚本 - @codex 2025-11-30
  - [x] 更新依赖引用 - @codex 2025-11-30

### 阶段 4 验收标准

- [x] `pnpm --filter @closetcutie/types build` 成功 - @codex 2025-11-30
- [x] `pnpm --filter @closetcutie/services build` 成功 - @codex 2025-11-30
- [x] `pnpm build` 全部成功 - @codex 2025-11-30

---

## 阶段 5: 版本管理 (Changesets)

**预计耗时**: 30 分钟
**风险级别**: 低
**前置条件**: 阶段 4 完成

### 任务清单

- [ ] **5.1** 安装 Changesets

  ```bash
  pnpm add -Dw @changesets/cli@^2.27.0
  ```

- [ ] **5.2** 初始化 Changesets

  ```bash
  pnpm changeset init
  ```

- [ ] **5.3** 配置 `.changeset/config.json`
  - [ ] 设置 `access: "restricted"` (私有包)
  - [ ] 设置 `baseBranch: "main"`

- [ ] **5.4** 添加 package.json 脚本
  - [ ] `changeset`
  - [ ] `version`
  - [ ] `release`

### 阶段 5 验收标准

- [ ] `.changeset/` 目录存在
- [ ] `pnpm changeset` 可正常执行

---

## 阶段 6: CI/CD (GitHub Actions)

**预计耗时**: 1 小时
**风险级别**: 低
**前置条件**: 阶段 5 完成

### 任务清单

- [ ] **6.1** 创建 `.github/workflows/` 目录

- [ ] **6.2** 创建 `.github/workflows/ci.yml`
  - [ ] format job
  - [ ] lint job (matrix: web, uni)
  - [ ] build job

- [ ] **6.3** (可选) 创建 `.github/workflows/release.yml`
  - [ ] Changesets action 配置

- [ ] **6.4** 配置 GitHub Secrets (如需要)
  - [ ] `TURBO_TOKEN` (可选，用于 Turbo Remote Cache)
  - [ ] `TURBO_TEAM` (可选)

### 阶段 6 验收标准

- [ ] Push 到 GitHub 后 CI 自动运行
- [ ] CI 所有 job 通过 (或已知问题已记录)

---

## 阶段 7: 文档完善

**预计耗时**: 30 分钟 - 1 小时
**风险级别**: 低
**前置条件**: 阶段 6 完成

### 任务清单

- [ ] **7.1** 更新 `README.md`
  - [ ] 更新环境要求 (pnpm 9+)
  - [ ] 更新安装命令
  - [ ] 添加代码规范说明
  - [ ] 添加提交规范

- [ ] **7.2** 创建 `CONTRIBUTING.md`
  - [ ] 开发流程
  - [ ] 常用命令
  - [ ] 提交规范
  - [ ] 代码规范

- [ ] **7.3** (可选) 清理/归档此改造文档
  - [ ] 移动 `.claude/MONOREPO_UPGRADE_PLAN.md` 到 `docs/` 或删除

### 阶段 7 验收标准

- [ ] README.md 更新完成
- [ ] CONTRIBUTING.md 创建完成
- [ ] 新开发者可根据文档完成环境搭建

---

## 总体验收清单

完成所有阶段后，执行最终验收：

- [ ] `pnpm install` 成功 (无警告/错误)
- [ ] `pnpm dev` 所有应用正常启动
- [ ] `pnpm build` 全部成功
- [ ] `pnpm lint` 通过 (或仅剩可接受的警告)
- [ ] `pnpm format:check` 通过
- [ ] `pnpm type-check` 通过
- [ ] Git commit 触发 pre-commit hook
- [ ] CI 流程正常运行
- [ ] 文档更新完成

---

## 问题记录

> 在此记录改造过程中遇到的问题和解决方案

### 示例格式

**问题**: [问题描述]
**日期**: YYYY-MM-DD
**解决方案**: [解决方案描述]
**相关任务**: [任务编号]

---

## 变更记录

| 日期       | 变更内容     | 执行人 |
| ---------- | ------------ | ------ |
| 2025-01-28 | 创建工作计划 | Claude |
