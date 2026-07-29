# Task 03：素材包与动画播放引擎

阅读 docs/ANIMATION_SPEC.md、docs/ASSET_PIPELINE.md 和 docs/ARCHITECTURE.md。

目标：定义 AssetManifest schema，加载示例宠物素材包，并通过 PixiJS 播放 Idle 动画。

要求：资源缺失或 manifest 错误时降级到静态占位图，不崩溃。不要加入 AI 生成能力。

验收：schema 校验、错误降级、锚点/命中框生效；测试通过。