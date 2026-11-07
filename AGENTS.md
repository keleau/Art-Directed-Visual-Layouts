# flavor-atlas

React 19 + Vite 8 + Tailwind CSS 4 的移动端美食探索应用，使用 JavaScript / JSX（无 TypeScript）。

## 开发

```bash
npm install
npm run dev
```

开发服务器默认运行在 `http://localhost:8443`（可用 `PORT` 环境变量覆盖）。预览面板会自动显示。

## 构建

```bash
npm run build
npm run preview
```

## 结构

- `src/main.jsx`：入口，挂载 `App`
- `src/App.jsx`：页面栈、购物车与结算状态
- `src/screens/`：Explore、Today、Cook、Recipe、Me、Search、Shop、ShopItemDetail、Splash
- `src/components/`：通用组件（导航、购物车抽屉、结算弹窗、时段入场、产品卡、产品图形、图标等）
- `src/data/`：图片映射、国家菜谱、每日主厨、商城数据
- `src/lib/`：食材匹配、产品分组、时段与程序化环境音
- `src/hooks/`：滚动显现、可拖拽浮动按钮
- `src/index.css` / `src/fonts.css`：Tailwind 主题、全局动效、自托管字体
- `public/images/`：本地菜品与场景图片
- `docs/`：README 截图与图片来源清单

## 约定

- 使用 npm 与 `package-lock.json`。
- 图片与字体全部本地化，运行时不请求外部图床或 Google Fonts。
- 商城中的菜品使用摄影图；食材与调味料使用统一的“档案卡”视觉（`ProductArtwork`），避免图库图片错配。
- 演示结算不会产生真实扣款。
