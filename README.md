# BuddyDog

BuddyDog 是一只低打扰、长期耐用的桌面数字伙伴。当前仓库处于 Phase 1，
Sprint 1 仅包含 Electron + React + TypeScript + PixiJS 的最小工程骨架。

## 环境要求

- Node.js 22.12 或更高版本
- npm 10 或更高版本
- Windows 10/11 或 macOS 13+

## 本地运行

```bash
npm install
npm run dev
```

开发模式会打开一个普通的 BuddyDog 测试窗口。本阶段尚未实现透明宠物窗口、
宠物动画、提醒系统或设置页面。

## 质量检查

```bash
npm run lint
npm run typecheck
npm test
```

## 构建

```bash
npm run build
```

构建产物输出到 `out/`。安装包配置将在后续 Sprint 中按 Phase 1 计划补充。

## 项目结构

```text
src/
  main/       Electron 主进程
  preload/    受限的 renderer 桥接层
  renderer/   React 界面
  shared/     跨进程共享的纯 TypeScript 模块
```

项目启用 TypeScript strict。renderer 禁止直接访问 Node.js，并使用
`contextIsolation` 与 sandbox。
