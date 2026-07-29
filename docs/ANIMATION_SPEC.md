# BuddyDog Phase 1 动画规范

## 1. 动画目标
首版强调“像同一只狗”和“动作自然”，不追求动作数量。所有动作必须使用同一角色参考和统一透视、光线、描边/写实程度。

## 2. 必需动作
1. Idle：轻微呼吸、耳朵或尾巴小动作。
2. Walk Left / Right：左右行走，可镜像但需检查不对称花纹、项圈和耳朵方向。
3. Sit：自然坐下并保持。
4. Sleep：趴下或蜷卧，微弱呼吸。
5. Happy：点击后的摇尾巴、轻跳或转身，选一种即可。

## 3. 素材格式
优先方案：透明 PNG 序列 + JSON 元数据。
- 统一画布尺寸。
- 锚点统一在脚底中心或身体接地中心。
- 每帧透明边缘干净，无白边、黑边。
- 文件名：action_0001.png。
- 元数据记录 fps、loop、anchor、hitbox、duration。

## 4. 帧率建议
- Idle/Sleep：8-12 fps。
- Walk/Happy：12-18 fps。
- 不要求 60 fps 素材；运行时可按显示刷新绘制。

## 5. 一致性检查
- 脸型、眼睛、鼻子、耳朵、毛色、花纹、体型、尾巴长度不得漂移。
- 同一动作首尾需可循环，避免跳帧。
- 接地位置稳定，不能“脚底漂浮”。
- 左右镜像前检查宠物左右不对称特征。

## 6. 资源清单
assets/pets/default/
- manifest.json
- reference/
- idle/
- walk_left/
- walk_right/
- sit/
- sleep/
- happy/
- thumbnail.png