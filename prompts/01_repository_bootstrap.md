# Task 01：初始化仓库与工程骨架

请先阅读 AGENTS.md、docs/PRODUCT_VISION.md、docs/PRD_PHASE1.md 和 docs/ARCHITECTURE.md。

目标：创建 Electron + React + TypeScript + PixiJS 的最小可运行工程骨架。

要求：
- 先检查当前仓库，给出 5-10 条实施计划，再开始修改。
- 实现主进程、preload、renderer 的安全基础结构。
- 启用 TypeScript strict、contextIsolation，关闭 nodeIntegration。
- 添加 lint、typecheck、unit test、dev、build 脚本。
- 只显示一个普通测试窗口即可；本任务暂不做透明宠物窗口和提醒。
- 添加 README：本地运行、测试、构建命令。

验收：npm install 后，开发模式可启动；lint、typecheck、test、build 全部通过。
完成后列出修改文件、命令结果、风险与下一步。