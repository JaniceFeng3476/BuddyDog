# BuddyDog

BuddyDog 是一只低打扰、长期耐用的桌面数字伙伴。当前仓库处于 Phase 1，
Sprint 3 已包含 Electron 透明桌面宠物窗口、PixiJS 舞台和本地 Idle 占位动画。

## 环境要求

- Node.js 22.12 或更高版本
- npm 10 或更高版本
- Windows 10/11 或 macOS 13+

## 本地运行

```bash
npm install
npm run dev
```

开发模式会在主屏幕右下方打开透明、无边框、置顶的 BuddyDog 窗口。拖动占位
宠物可以移动窗口。鼠标位于窗口上时，可使用 `Ctrl` + 滚轮或 `Ctrl` +
`+`/`-` 缩放，使用 `Ctrl` + `0` 恢复默认大小。当前播放项目内原创的透明 PNG
占位动画；正式宠物素材、行为状态机、提醒系统和设置页面尚未实现。

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
