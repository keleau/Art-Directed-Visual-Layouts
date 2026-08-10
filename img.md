---
name: multi-stock-image-fetcher
description: 四源无版权商用图搜索技能，优先级：Unsplash→Pexels→Pixabay→Picsum随机兜底，自动中英关键词转换、横竖图筛选、版权标注，触发词：找图、配图、背景图、素材、无版权图、stock图、unsplash、pexels、pixabay
env:
  UNSPLASH_ACCESS_KEY: "jVBc3JYExaSoARgz6vyKxn2cuFnutXe_2fL_7JCUfu0"
  PEXELS_API_KEY: "c3I9YL9wTiSgKBRQkFyvK65G2fuqfxIsQHilhticVitWZ09jozPNHf4G"
  PIXABAY_API_KEY: ""
---
## 一、技能定位
作为商用免费图库聚合工具，用户需要配图、背景图、网页素材、文章插图时，按优先级调用三大付费密钥图库API，全部密钥失效/无结果时启用Picsum无密钥随机图兜底，输出可直接用于前端、Markdown的图片直链+版权来源说明。

## 二、前置环境变量配置（必须填入对应Key）
1. UNSPLASH_ACCESS_KEY：Unsplash开发者后台Access Key
2. PEXELS_API_KEY：Pexels平台API密钥
3. PIXABAY_API_KEY：Pixabay平台API密钥
4. Picsum无需任何密钥，作为保底图源

## 三、API接口与鉴权规则
### 1. Unsplash（接口+鉴权）
地址：https://api.unsplash.com/search/photos
请求头：Authorization: Client-ID ${UNSPLASH_ACCESS_KEY}
免费额度：50次/小时
可用参数：query、per_page、orientation（landscape横图/portrait竖图/squarish正方形）

### 2. Pexels（接口+鉴权）
地址：https://api.pexels.com/v1/search
请求头：Authorization: ${PEXELS_API_KEY}
免费额度：200次/小时
可用参数：query、per_page、orientation

### 3. Pixabay（接口+鉴权）
地址：https://pixabay.com/api/
鉴权方式：URL拼接key=${PIXABAY_API_KEY}
免费额度：5000次/天
可用参数：q、image_type=photo、per_page

### 4. Picsum（兜底，无密钥）
随机图地址：https://picsum.photos/width/height?query=关键词
定向关键词图：https://picsum.photos/id/随机ID

## 四、标准执行流程（严格按顺序执行）
### 步骤1：关键词预处理
- 用户中文关键词自动翻译为**英文关键词**（图库API原生英文检索效果最优）
- 记录原始中文关键词、转换后英文关键词
- 询问/默认图片比例：网页Banner默认`landscape横图`，手机海报`portrait竖图`，头像卡片`squarish正方形`，无指定统一横图

### 步骤2：分优先级串行调用API
1. 优先调用Unsplash API，curl请求获取图片链接、作者、图源
   - 200正常：直接收录结果，停止后续API调用
   - 401=密钥为空/错误、403=额度耗尽、无结果：进入下一个图源Pexels
2. Pexels API调用，成功则返回，失败进入Pixabay
3. Pixabay API调用，成功则返回，失败直接启用Picsum兜底随机图

### 步骤3：结果格式化输出规范
固定排版输出，禁止编造图片链接：
【检索关键词】中文：xxx | 英文：xxx
【图片比例】横图/竖图/正方形
【图源来源】Unsplash / Pexels / Pixabay / Picsum（兜底）
### 可选图片链接（Regular适中尺寸，适合网页）
1. 图片直链 | 摄影师作者 | 商用版权说明
2. 图片直链 | 摄影师作者 | 商用版权说明
### 原图高清链接（用于下载）
1. 高清原图地址

### 步骤4、异常报错提示
- Unsplash 401：提示「Unsplash密钥未配置或失效，请补充UNSPLASH_ACCESS_KEY环境变量」
- Unsplash 403：提示「Unsplash调用额度用尽，1小时后重置额度」
- 三大图库全部无返回：「三大图库无匹配素材，启用Picsum无版权随机兜底图」

## 五、curl调用模板（内部执行使用）
### Unsplash CURL示例
```bash
curl -H "Authorization: Client-ID ${UNSPLASH_ACCESS_KEY}" "https://api.unsplash.com/search/photos?query=sea+sunset&per_page=5&orientation=landscape"