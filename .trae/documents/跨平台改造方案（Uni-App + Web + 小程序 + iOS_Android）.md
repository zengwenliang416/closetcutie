## 当前项目综述

- 前端栈：`React + Vite + TypeScript`
- 样式：`Tailwind CDN` + `Google Fonts: Fredoka`
- 形态：单页应用（无路由框架），浏览器端为主
- 功能：存储单元/衣物条目管理、图片识别（Gemini）、搜索筛选
- 安全：在前端直接持有 `GEMINI_API_KEY`，需要后端代理以保障安全

## 目标与平台

- 保持现有 UI 风格与交互
- 同一产品覆盖：`Uni-App 端（H5/App-Plus）`、`小程序端（微信/支付宝可扩展）`、`网页端（SPA）`、`iOS`、`Android`
- 尽可能复用业务模型与设计系统，实现“同视觉、同体验”

## 技术路线选型

- 主推荐：以 `Uni-App（Vue3 + Vite）` 为跨平台核心，输出 `H5`、`App-Plus（iOS/Android）`、`MP-WEIXIN`
- 网页端保留：维持现有 `React + Vite` Web 版，逐步抽象共享层以复用模型与样式令牌
- 样式一致性方案：
  - 提取「设计令牌」为 CSS 变量（颜色、圆角、阴影、间距、字体）
  - `Web(React)` 使用 `Tailwind` 读取变量；`Uni-App(Vue)` 使用 `UnoCSS` 或 `tailwindcss-uni` 映射同名工具类
- 备选（仅在坚持 React 全平台时）：`Taro(React)` 统一 H5/小程序/RN，但 RN 维护成本更高、生态复杂，优先级次之

## 架构与目录（单仓 Monorepo）

- 顶层：`pnpm`/`npm workspaces`
- `apps/web`：现有 `React + Vite`，引入设计令牌与路由
- `apps/uni`：`Uni-App(Vue3)`，跨平台编译 `H5/APP-PLUS/MP-WEIXIN`
- `packages/ui`：无关框架的样式令牌（CSS 变量）、图标资源、统一配色
- `packages/types`：`Category/StorageUnit/ClothingItem` 等模型与类型
- `packages/services`：业务服务接口规范（AI 识别、存储），前端通过同一接口调用
- `apps/api`：轻量后端代理（如 `Hono/Express`）封装 Gemini 调用，服务端持有密钥

## 统一设计与样式

- 字体与基色：保留 `Fredoka`，统一主色系、阴影、圆角与间距
- 设计令牌：`:root { --color-pink-100; --radius-3xl; --shadow-soft; ... }`
- Web：`tailwind.config.js` 引用 CSS 变量；保留现有类名风格
- Uni-App：`UnoCSS` 或 `tailwindcss-uni` 生成等效工具类；在 `app.vue` 全局注入变量
- 图标：将 `Icons.tsx` 转为跨框架 SVG 资产，在各端封装组件

## 核心页面与功能

- `首页（存储总览）`：网格卡片、搜索、分类筛选
- `存储详情`：衣物列表、颜色/标签过滤
- `添加衣物`：拍照/相册、AI 识别名称/类别/颜色/标签、手动修正
- `衣物详情`：图片、标签、关联存储、编辑
- `设置`：数据备份与导入、隐私与权限、调试

## 跨平台适配要点

- 摄像头/相册：
  - Web：`<input type="file">` + `MediaDevices`
  - Uni-App：`uni.chooseImage`/`uni.compressImage`；原生权限处理
  - 小程序：`wx.chooseImage`
- 存储：
  - Web：`localStorage`/`IndexedDB`
  - Uni-App：`uni.setStorage`；抽象统一存储接口
- 路由：
  - Web：`react-router` 引入
  - Uni-App：`pages.json` 声明式路由
- 文件上传与 AI：统一走后端代理 API（避免在客户端暴露密钥）

## 数据与安全

- 后端代理：`apps/api` 暴露 `POST /ai/identify`，服务端调用 `Gemini` 返回结构化识别结果
- 身份与限流：基础的 API Key/Token、速率限制与日志
- 存储同步：本地存储为主，后续可引入云同步（如 `Supabase/Firestore`）

## 交付与验证

- Web：`npm run dev` 本地预览、端到端用例（添加/识别/搜索）
- Uni-App：`H5` 与 `MP-WEIXIN` 运行验证；`APP-PLUS` 真机调试拍照流程
- 测试：模型与服务接口的单元测试；关键流程的端到端脚本
- 文档：`README` 与平台运行指引、权限与发布流程

## 改造步骤

1. 抽取设计令牌到 `packages/ui`，两端接入（Tailwind/UnoCSS）
2. 统一 `types` 与 `services` 接口，逐步迁移 Web 端到共享层
3. 搭建 `apps/api` 后端代理，迁移前端 AI 调用
4. 初始化 `apps/uni`（首页/详情/添加衣物），打通拍照与识别链路
5. 引入路由与数据持久化抽象，完成跨端搜索/筛选
6. 完成图标与组件一致性对齐、细节打磨与发布脚本

## 关键取舍

- 选择 Uni-App（Vue3）意味着跨端收益更高，但与现有 React 存在框架差异；通过共享模型/令牌降低重写成本
- 若坚持 React 全家桶，可采用 Taro；但 RN 与小程序端适配复杂度更高，整体交付风险与维护成本上升

## 需要确认

- 小程序目标平台范围（默认先做微信）
- 是否接受后端代理（保障密钥安全）
- 是否采用 Monorepo 工作空间管理
- 是否允许对现有 Web 端引入路由与构建式 Tailwind（替换 CDN）
