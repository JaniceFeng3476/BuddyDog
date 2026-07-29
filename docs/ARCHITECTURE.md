# BuddyDog Phase 1 技术设计

## 1. 技术选型
建议首版：Electron + React + TypeScript + PixiJS。
- Electron：Windows/macOS 打包、透明窗口、托盘、开机启动能力成熟。
- React：设置页与状态管理。
- PixiJS：2D 精灵动画和命中区域。
- 配置存储：electron-store 或等价本地 JSON；Phase 1 不需要 SQLite。
- 测试：Vitest + Playwright；主进程关键逻辑增加单元测试。

备注：Electron 的内存目标应务实。首版以稳定跨平台为先，若未来需要更轻量可评估 Tauri，但不要在 Phase 1 同时维护两套壳。

## 2. 进程划分
- Main process：窗口、托盘、开机启动、系统状态、设置持久化、提醒调度。
- Renderer process：PixiJS 宠物舞台、状态机、气泡、设置 UI。
- Preload：通过 contextBridge 暴露最小化 IPC API，禁用 nodeIntegration，启用 contextIsolation。

## 3. 模块
src/main/
- windowManager.ts
- trayManager.ts
- reminderScheduler.ts
- settingsStore.ts
- autoLaunch.ts
- systemContext.ts

src/renderer/
- pet/PetEngine.ts
- pet/BehaviorStateMachine.ts
- pet/AnimationController.ts
- pet/MovementController.ts
- reminder/ReminderBubble.tsx
- settings/SettingsPanel.tsx

shared/
- types.ts
- constants.ts
- schemas.ts

## 4. 数据模型
Settings：petScale、locked、reminderIntervalMinutes、enabledReminderTypes、remindersPausedUntil、autoLaunch、lastWindowBounds、assetPackId。

AssetManifest：id、version、canvasSize、anchor、hitbox、animations（frames/fps/loop）。

## 5. 安全与稳定
- 关闭 renderer 的 Node 直接访问。
- IPC 白名单与参数校验。
- 不执行素材包中的脚本。
- manifest 使用 schema 校验。
- 日志轮转，避免无限增长。
- 更新机制不进入 Phase 1，可预留接口。

## 6. 构建输出
- Windows：安装版 .exe（优先 NSIS）。
- macOS：.dmg/.app；正式分发前需代码签名与公证，内部测试可先使用未签名构建。
- CI 初期可后置，先确保本地两平台构建脚本明确。

## 7. 决策记录
- ADR-001：Phase 1 使用 Electron，不做 Tauri 双实现。
- ADR-002：素材生成与客户端解耦。
- ADR-003：提醒规则本地化，不接云端。
- ADR-004：先实现单一人格，不做性格选择器。