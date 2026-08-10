# Debug Session: today-animation-not-playing
## Status: [OPEN]

## User Feedback
"为什么无论怎么改，today页面的动画都不会变"
"这张就是现在你给我改的效果，没有什么变化"

## Hypotheses (Falsifiable)

### H1: playedPeriods 缓存问题
- **Claim**: `playedPeriods` Set 缓存了已播放的时段，导致同一时段再次进入时动画不触发
- **Likelihood**: HIGH
- **Evidence**: 
  - 代码中有 `playedPeriods.clear()` 但只在模块加载时执行一次
  - `periodKey = ${period}-${effectiveCountry}` 如果时段和国家不变，动画永远不会重播
  - 用户刷新页面后如果还是同一个时段，动画也不会播放（因为模块级 Set 在 SPA 中可能持久化）

### H2: active prop 传递问题
- **Claim**: `active` prop 可能为 false，导致 `useEffect` 中的条件 `if (active && !playedPeriods.has(periodKey))` 不满足
- **Likelihood**: MEDIUM
- **Evidence**: 需要检查 App.tsx 中 TodayScreen 的 active prop 传递

### H3: 浏览器热更新未生效
- **Claim**: Vite HMR 可能因某些原因没有正确替换组件代码
- **Likelihood**: MEDIUM
- **Evidence**: 用户反复反馈修改无效果，可能是浏览器缓存或构建问题

### H4: 入口动画 JSX 条件渲染问题
- **Claim**: 入口动画组件可能根本没有渲染到 DOM 中
- **Likelihood**: MEDIUM
- **Evidence**: 需要检查 `{showIntro && (...)}` 代码块的完整性

### H5: 用户指的是 Hero 卡片（常驻图片）的动画，而非入口动画
- **Claim**: 用户可能期望的是 Hero 卡片上的 Ken Burns 等动画效果，而不是页面加载时的入口动画
- **Likelihood**: HIGH
- **Evidence**: 用户最近的反馈 "图片上的文案要匹配我的主题呀"、"就感觉一张图片摆在哪生硬的就过去了" 说明用户关注的是 Hero 卡片上的图片动画

## Debug Plan
1. 检查 App.tsx 中 TodayScreen 的 active prop 传递
2. 在 TodayScreen.tsx 中添加调试日志插桩
3. 检查设计预览页面的动画是否正常
4. 验证 CSS 动画类是否真的被浏览器识别
5. 确认用户期望的是哪种动画