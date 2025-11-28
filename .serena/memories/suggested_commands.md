# 常用开发命令

## 安装依赖
```bash
npm install
```

## 开发模式
```bash
# 同时运行所有应用
npm run dev

# 单独运行 Web 应用
npm run web:dev

# 单独运行 Uni-App (H5)
npm run uni:dev

# 单独运行 API 服务
npm run api:dev

# 使用 Turbo 过滤器运行特定包
npm run dev --filter=closetcutie-web
npm run dev --filter=closetcutie-uni
```

## Uni-App 多平台开发
```bash
# H5
npm --prefix apps/uni run dev:h5

# 微信小程序
npm --prefix apps/uni run dev:mp-weixin

# iOS App
npm --prefix apps/uni run dev:app-ios

# Android App
npm --prefix apps/uni run dev:app-android
```

## 构建
```bash
# 构建所有应用
npm run build

# 构建 Uni-App H5
npm --prefix apps/uni run build:h5

# 构建微信小程序
npm --prefix apps/uni run build:mp-weixin
```

## 代码检查
```bash
# 运行 lint
npm run lint

# Uni-App 类型检查
npm --prefix apps/uni run type-check
```

## 清理
```bash
# 清理所有 node_modules
npm run clean
```

## 系统命令 (macOS/Darwin)
```bash
ls -la         # 列出文件
find . -name   # 查找文件
grep -r        # 搜索内容
```
