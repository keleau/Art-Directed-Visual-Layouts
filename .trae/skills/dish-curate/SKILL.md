---
name: "dish-curate"
description: "Curates dish copywriting and images for the Flavor Atlas project, ensuring text-image consistency and successful-case imagery. Invoke when adding a new dish/菜品, updating dish images, or fixing image-text mismatches."
---

# 菜品文案与图片筛选 Skill

为 Flavor Atlas 项目（Art-Directed Visual Layouts）筛选菜品文案和图片，确保**图文一致**且图片为**成功制作案例**。当用户要添加新菜、更换菜品图片、修复图文不匹配时调用本 skill。

---

## 一、适用场景

- 用户说「加个新菜」「添加菜品」「新增一道菜」
- 用户说「这道菜的图片不对/图文不符」
- 用户说「换张图」「图片和菜名对不上」
- 任何涉及 `COUNTRIES`、`SHOP_ITEMS`、`Meal.img`、`ShopItem.img` 字段改动的任务

---

## 二、项目数据结构（必须遵守）

### Meal 类型（菜品，见 [src/types.ts](file:///c:\Users\30335\Downloads\Art-Directed Visual Layouts\src\types.ts)）

```ts
type Meal = {
  en: string      // 英文菜名（首字母大写，如 "Cacio e Pepe"）
  cn: string      // 中文菜名（如 "芝士黑胡椒意面"）
  story: string   // 故事/文化背景，2-4 句，体现产地与工艺
  kcal: number    // 卡路里（整数，如 580）
  time: string    // 烹饪时间（如 "25 min"）
  img: string     // 图片 URL（Unsplash，w=800&h=600）
  taste: string   // 口感标签（如 "Rich · Creamy"）
  price: number   // 价格（人民币整数）
  difficulty: string  // 难度（Easy / Medium / Hard）
  macros: { protein: string; carbs: string; fats: string }  // 如 "28g"
  recipe: {
    ingredients: { n: string; t: string }[]  // 食材，n=名称 t=用量
    steps: { n: string; t: string; d: string }[]  // 步骤，n=序号 t=标题 d=描述
  }
}
```

### 数据位置

- 菜品数据：`src/data.ts` 中 `COUNTRIES` 对象，按国家（japan/italy/mexico/france/thailand/china）→ mealKey（breakfast/lunch/dinner/dessert/snack/streetFood）组织
- 商店菜品（dish 类）：自动从 `COUNTRIES` 生成，见 `DISH_ITEMS`
- 食材/调料：`SHOP_ITEMS` 数组，图片引用 `SHOP_IMGS` 对象

---

## 三、文案筛选规范

### 1. 菜名（en / cn）
- `en`：使用地道英文菜名，首字母大写，多词菜名保留原拼写（如 "Pad Thai"、"Cacio e Pepe"）
- `cn`：使用通行中文译名，避免直译生硬（如 "冬阴功" 而非 "酸辣虾汤"）
- 两者必须指向**同一道菜**，不能 en 是意面、cn 是披萨

### 2. story（故事）
- 2-4 句，体现产地文化、历史或工艺
- 包含国家/地区线索（与 `country` 字段一致）
- 避免与 hero.quote 或 chefLetter 文案重复
- 避免空泛描述（如「这是一道美味的菜」）

### 3. taste（口感）
- 格式：`主味 · 次味`（如 "Spicy · Sour"、"Rich · Creamy"）
- 主味必填，次味可选
- 必须与菜品实际口味匹配（不能给甜品标 "Spicy"）

### 4. 难度/卡路里/营养
- `difficulty`：Easy / Medium / Hard（三选一）
- `kcal`：基于实际份量估算，整数
- `macros`：蛋白/碳水/脂肪，格式 "28g"，数值合理

### 5. recipe
- `ingredients`：6-12 项，每项 `n` 为食材英文名、`t` 为用量（如 "200g"、"2 cloves"）
- `steps`：4-8 步，`n` 为序号（"01"、"02"）、`t` 为步骤标题、`d` 为详细描述
- 步骤必须可复现，不能出现「魔法般完成」这类无意义描述

---

## 四、图片筛选规范（核心）

### 1. 来源
- **优先使用 Unsplash**：`https://images.unsplash.com/photo-<id>?w=800&h=600&fit=crop&auto=format`
- 商品图（ShopItem）用 `w=400&h=400&fit=crop`（方形）
- 菜品图（Meal）用 `w=800&h=600&fit=crop`（横版）
- 不使用 Pexels/Pixabay 等其他源，保持全站风格统一

### 2. 图文一致性（强制）
图片必须**精确对应**菜品名称，禁止以下情况：
- ❌ 菜名是「南姜 Galangal」但图片是普通生姜
- ❌ 菜名是「牛胸肉 Brisket」但图片是牛排
- ❌ 菜名是「三文鱼刺身」但图片是熟三文鱼排
- ❌ 菜名是「抹茶拿铁」但图片是普通拿铁

**验证方法**：在最终确定 URL 前，必须用 `RunCommand` 执行 HTTP 状态码检测，并人工核对图片内容描述与菜名是否匹配。

### 3. 成功案例（强制）
图片必须是**成品/成功案例**：
- ✅ 菜品图：摆盘完成的成品，光线明亮，构图居中
- ✅ 食材图：新鲜、清晰的食材特写
- ❌ 半成品、烹饪过程、脏乱的厨房场景
- ❌ 低分辨率、过度滤镜、水印明显
- ❌ 与菜品无关的装饰图、风景图

### 4. URL 有效性验证流程

每张候选图片必须通过以下检测：

```powershell
# 用 RunCommand 工具执行（非 Bash）
$url = "<候选图片URL>"
try {
  $r = Invoke-WebRequest -Uri $url -Method Head -TimeoutSec 10 -UseBasicParsing
  Write-Output "$($r.StatusCode)  $url"
} catch {
  Write-Output "FAIL  $url  $($_.Exception.Message)"
}
```

- 状态码必须是 `200`，否则丢弃换图
- 批量验证时一次最多 10 张，避免超时

### 5. 图片复用检查

新增菜品前，用 Grep 检查候选图片 ID 是否已被项目其他菜品/商品使用：

```
Grep pattern: "<photo-id>"
path: c:\Users\30335\Downloads\Art-Directed Visual Layouts\src\data.ts
```

- 同一张图**不能**用于两道不同菜品
- 同一张图**不能**同时用于食材和调料（除非确实是同一食材）
- 发现复用时，必须为新品类寻找新图

---

## 五、新增菜品完整工作流

当用户要加新菜时，按此顺序执行：

1. **确认归属**：问清菜品归属哪个国家（japan/italy/mexico/france/thailand/china）和哪个 mealKey（breakfast/lunch/dinner/dessert/snack/streetFood）
2. **写文案**：按第三节规范填写所有字段，story/taste 必须与国家文化一致
3. **找图**：
   - 在 Unsplash 搜索菜品英文名 + 关键词（如 "tonkotsu ramen bowl"）
   - 选 3 张候选，都跑第四节第 4 步的 HTTP 验证
   - 选 200 状态且图文最匹配的一张
   - 用 Grep 检查图片 ID 未被复用
4. **写入数据**：编辑 [src/data.ts](file:///c:\Users\30335\Downloads\Art-Directed Visual Layouts\src\data.ts) 对应国家对象的对应 mealKey
5. **类型检查**：`npx tsc --noEmit` 必须通过
6. **构建验证**：`npx vite build` 必须通过
7. **报告**：向用户展示新菜的 en/cn/img URL，并说明图片验证已通过

---

## 六、修复图文不匹配工作流

当用户报告「图片和菜名对不上」时：

1. **定位**：用 Grep 找到出错的菜品在 data.ts 中的位置
2. **分析错配**：确认当前图片实际显示的内容 vs 菜名应该显示的内容
3. **找替代图**：按第四节规范找新图，跑 HTTP 验证
4. **替换并验证**：更新 `img` 字段，`npx tsc --noEmit` + `npx vite build`
5. **同步检查**：如果该菜品同时存在于 `SHOP_ITEMS`（dish 类自动生成），确认图片也同步更新（dish 类自动从 Meal.img 继承，无需手动改）

---

## 七、检查清单（提交前必过）

- [ ] `en` 和 `cn` 指向同一道菜
- [ ] `story` 包含正确的国家文化线索
- [ ] `taste` 与菜品类型匹配（甜品不标 Spicy 等）
- [ ] `img` URL 返回 HTTP 200
- [ ] 图片内容与菜名精确匹配（人工核对）
- [ ] 图片为成品/成功案例
- [ ] 图片 ID 未被 data.ts 其他条目复用
- [ ] 图片尺寸参数正确（菜品 800×600，商品 400×400）
- [ ] `npx tsc --noEmit` 通过
- [ ] `npx vite build` 通过

---

## 八、常用命令

```powershell
# 类型检查
npx tsc --noEmit

# 构建
npx vite build

# 批量验证图片（最多 10 张）
$urls = @("url1","url2","url3")
$urls | ForEach-Object {
  try {
    $r = Invoke-WebRequest -Uri $_ -Method Head -TimeoutSec 10 -UseBasicParsing
    "$($r.StatusCode)  $_"
  } catch { "FAIL  $_" }
}
```
