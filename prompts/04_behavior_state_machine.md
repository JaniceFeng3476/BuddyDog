# Task 04：基础行为状态机

阅读 docs/UX_BEHAVIOR_SPEC.md 和 docs/ANIMATION_SPEC.md。

目标：实现 Idle、WalkLeft、WalkRight、Sit、Sleep、Happy、Dragging 的状态机和冷却规则。

要求：状态机逻辑与渲染解耦；随机数可注入以便测试；不要增加 Phase 2 动作。

验收：合法转移、最短停留、点击冷却、拖动优先级均有自动测试。