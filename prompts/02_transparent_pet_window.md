# Task 02：透明桌面宠物窗口

阅读 AGENTS.md、docs/PRD_PHASE1.md、docs/UX_BEHAVIOR_SPEC.md 和 docs/ARCHITECTURE.md。

目标：实现透明、无边框、置顶的宠物窗口，并显示一张临时透明 PNG。

范围：窗口创建、拖动、安全边界、右键退出。暂不实现动画状态机、提醒和设置页。

验收：
- Windows/macOS 开发环境可运行。
- 背景透明，无标题栏。
- 可拖动，释放后不完全离开屏幕。
- 右键菜单可退出。
- 透明区域尽量不阻挡桌面操作，并记录平台限制。
- 新逻辑有测试或可验证的纯函数测试。

执行后运行 lint、typecheck、test、build，并汇报。