<div align="center">
  <img src="docs/banner.jpg" alt="风味图谱 Flavor Atlas" width="100%" />

  # 风味图谱 · Flavor Atlas

  **一本写给味觉的护照。** 以目的地为线索的美食探索 Web 应用：每日主厨、时令菜谱、食材市集与旅行手账。

  React 19 · Vite 8 · Tailwind CSS 4 · JavaScript (JSX) · 零后端依赖

  [在线体验](https://keleau.github.io/Art-Directed-Visual-Layouts/) · [GitHub 仓库](https://github.com/keleau/Art-Directed-Visual-Layouts)
</div>

---

## 这个项目是什么

风味图谱是一个 **390 × 844 手机画布** 的沉浸式美食产品原型。它不满足于“菜单列表”，而是把「今天吃什么」拆成一条完整的体验链路：

**今日目的地 → 主厨来信 → 时令菜谱 → 食材加购 → 市集详情 → 购物车 → 演示结算 → 旅行护照**

6 个国家、36 道菜、101 件商品，全部数据与素材本地化，打开即用。

## 一眼能看到的完成度

| | |
|---|---|
| **9 个完整页面** | 开屏、探索、今日、厨房、菜谱、我的、搜索、市集、商品详情 |
| **完整业务闭环** | 菜谱配料自动匹配商城商品，一键加购、数量调整、结算成功态 |
| **时间感知体验** | 按中国时区切换早/午/黄昏/夜晚，触发对应入场动画与程序化环境音 |
| **真正的移动交互** | 可拖拽悬浮购物车、底部抽屉、粘性导航、滚动显现、视差主视觉 |
| **中文优先排版** | 全站中文文案 + 本地字体栈（宋体/黑体/楷体），不依赖 Google Fonts |
| **所有素材本地化** | 图片、字体随仓库分发，国内网络直接打开，无外部图床请求 |

## 页面截图

<p align="center">
  <img src="docs/screenshots/02-explore.png" width="24%" alt="探索页" />
  <img src="docs/screenshots/06-today.png" width="24%" alt="今日页" />
  <img src="docs/screenshots/10-cook.png" width="24%" alt="厨房页" />
  <img src="docs/screenshots/12-shop.png" width="24%" alt="市集页" />
</p>
<p align="center"><sub>探索 · 今日 · 厨房 · 市集</sub></p>

<p align="center">
  <img src="docs/screenshots/08-recipe.png" width="24%" alt="菜谱页" />
  <img src="docs/screenshots/13-shop-item-artwork.png" width="24%" alt="食材详情" />
  <img src="docs/screenshots/16-cart.png" width="24%" alt="购物车" />
  <img src="docs/screenshots/17-checkout.png" width="24%" alt="结算弹窗" />
</p>
<p align="center"><sub>菜谱 · 食材档案 · 购物车 · 结算</sub></p>

## 功能拆解

- **每日主厨**：按星期匹配目的地与主厨，今日主菜、主厨来信、招牌菜随日期变化。
- **六国菜单**：日本、意大利、墨西哥、法国、泰国、中国，每个国家 6 道菜，含卡路里、宏量营养、难度、口味与完整做法。
- **智能配料匹配**：把菜谱配料映射到商城可购商品；没有可单独购买的配料时，提供“直接买整道菜”的兜底路径。
- **市集**：101 件商品，按国家筛选、关键词搜索、商品详情、相似推荐、库存与标签。
- **购物车**：`localStorage` 持久化、数量增减、删除、浮动按钮可拖拽、桌面/手机都不挡内容。
- **搜索**：搜索 36 道菜与国家名，支持中英文；搜索历史可删除、可一键清空。
- **旅行护照**：探索国家、品尝菜品、完成菜谱、签证印章、成就与最爱菜系。
- **动效与声音**：时段入场动画、Ken Burns 主视觉、滚动显现、折叠卡片；Web Audio 程序化鸟鸣/咖啡馆/风铃/夜虫环境音。

## 技术栈

| 层 | 选型 |
|---|---|
| UI | React 19 |
| 构建 | Vite 8 |
| 样式 | Tailwind CSS 4 + 原生 CSS 动效 |
| 语言 | JavaScript / JSX（已从 TypeScript 迁移） |
| 状态 | React Hooks + `localStorage` |
| 声音 | Web Audio API（无音频文件） |
| 素材 | 本地 JPG / WOFF2 / SVG |

无 UI 组件库，无 CSS-in-JS，无后端依赖。

## 工程结构

```text
src/
├─ main.jsx                 # 入口
├─ App.jsx                  # 页面栈、购物车、结算
├─ screens/                 # 9 个页面
├─ components/              # 15+ 可复用组件
│  ├─ CartDrawer.jsx
│  ├─ CheckoutModal.jsx
│  ├─ FloatingCartButton.jsx
│  ├─ PeriodIntro.jsx
│  ├─ ProductCard.jsx
│  ├─ ProductArtwork.jsx
│  ├─ MealStats.jsx
│  └─ ...
├─ data/
│  ├─ images.js             # 图片映射
│  ├─ countries.js          # 六国 × 六餐 × 完整菜谱
│  ├─ heroes.js             # 每日主厨与目的地
│  └─ shop.js               # 菜品 / 食材 / 调味料
├─ lib/
│  ├─ matchShopItem.js      # 配料 → 商品匹配
│  ├─ productGroups.js      # 食材档案卡分组
│  ├─ periods.js            # 时段判定
│  └─ periodSound.js        # 程序化环境音
└─ hooks/                   # 滚动显现、可拖拽按钮
```

## 本地运行

要求 Node.js **20.19+**（Vite 8 的最低要求）。

```bash
npm install
npm run dev
```

打开 `http://localhost:8443`。生产构建：

```bash
npm run build
npm run preview
```

## 设计与素材说明

- **中文排版**：标题使用 Playfair Display + 宋体回退，正文使用 DM Sans + 苹方/微软雅黑，手写体使用 Caveat + 楷体；所有字体均为本地 WOFF2 或系统字体。
- **菜品图**：来自 Unsplash / Pexels 的免费图库素材，以及本项目用 AI 生成并替换的 5 张菜品图。
- **食材与调味料**：使用统一的“档案卡”视觉（大字 + 分类色 + 编号线条），避免图库图片与商品不符的问题。
- 图片来源与许可记录见 [`docs/image-manifest.json`](docs/image-manifest.json)。

> 结算流程为**演示**：点击“确认支付”只会清空购物车并展示成功态，不会产生真实扣款。

## 作者

**吴东盛** · 广州城建职业学院 · 2027 届 · 计算机应用技术

GitHub：[@keleau](https://github.com/keleau) · Gitee：[@keleau](https://gitee.com/keleau)
