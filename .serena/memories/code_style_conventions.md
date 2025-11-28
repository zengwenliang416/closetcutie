# 代码风格与约定

## 语言
- TypeScript 作为主要开发语言
- 所有类型定义集中在 `packages/types/index.ts`

## 项目结构约定
```
apps/
  web/          # React 应用
    src/
      components/   # React 组件
      pages/        # 页面组件
      services/     # 业务服务
      shared/       # 共享工具
      styles/       # 样式文件
  uni/          # Uni-App 应用
    src/
      pages/        # 页面 (按目录组织)
      stores/       # Pinia Store
      services/     # 业务服务
packages/
  types/        # 共享类型
  services/     # 共享服务
  ui/           # UI 资源 (tokens, icons)
```

## TypeScript 配置
- 目标: ES2022
- 模块: ESNext
- 严格模式启用
- 支持 JSX (preserve)

## 命名约定
- 组件: PascalCase (如 `StorageCard.tsx`, `ItemCard.tsx`)
- 文件: camelCase (如 `geminiService.ts`, `storage.ts`)
- Vue 页面: 目录结构 + index.vue (如 `pages/detail/index.vue`)

## 包引用
- 内部包使用包名引用: `closetcutie-types`, `closetcutie-services`, `closetcutie-ui`
- 版本: workspace 内使用 `*` 或 `^0.0.0`

## 框架约定
- Web: React 19 + 函数组件 + Hooks
- Uni-App: Vue 3 Composition API + `<script setup>`
- 状态管理: Pinia (Uni-App), React 内置状态 (Web)
