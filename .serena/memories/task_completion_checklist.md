# 任务完成检查清单

完成任务后，请执行以下检查：

## 1. 类型检查

```bash
# Uni-App
npm --prefix apps/uni run type-check

# 或使用 Turbo
npm run lint
```

## 2. 构建验证

```bash
npm run build
```

## 3. 开发测试

```bash
# 启动开发服务器并测试功能
npm run dev
```

## 4. 代码质量

- [ ] 无未使用的导入或变量
- [ ] 无 TypeScript 错误
- [ ] 遵循项目命名约定
- [ ] 共享代码放入 packages/
- [ ] 组件正确导入共享包

## 5. 跨平台检查 (Uni-App)

如果修改了 Uni-App 代码：

- [ ] H5 预览正常
- [ ] 如需要，测试小程序兼容性

## 6. 文档更新

如有架构变更，更新 README.md
