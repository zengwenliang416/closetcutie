# ClosetCutie 项目概述

## 项目目的

ClosetCutie 是一个基于 AI 的智能衣橱管理应用，用户可以拍照或上传衣物图片，AI 会自动识别并分类衣物。

## 项目架构

这是一个 **Monorepo** 项目，使用 Turborepo + npm workspaces 管理。

### 应用层 (apps/)

- **apps/web**: React 19 Web 应用 (Vite + React Router 7)
- **apps/uni**: 跨平台移动应用 (Uni-App + Vue 3 + Pinia)，支持 iOS、Android、微信小程序、H5
- **apps/api**: Node.js API 服务，代理 Gemini AI API

### 共享包 (packages/)

- **packages/types**: 共享 TypeScript 类型定义
- **packages/services**: 共享业务逻辑和 AI 服务
- **packages/ui**: 共享设计 tokens 和图标资源

## 技术栈

- **构建工具**: Turborepo, Vite
- **前端框架**: React 19 (Web), Vue 3 (Uni-App)
- **状态管理**: Pinia (Uni-App)
- **路由**: React Router 7 (Web)
- **AI 服务**: Google Gemini API (@google/genai)
- **语言**: TypeScript
- **包管理**: npm workspaces

## 环境要求

- Node.js v18+
- npm v9+
- `.env.local` 文件需配置 `GEMINI_API_KEY`
