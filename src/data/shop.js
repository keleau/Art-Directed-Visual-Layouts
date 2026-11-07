import { COUNTRIES } from './countries'

const MEAL_KEYS = ['breakfast', 'lunch', 'dinner', 'dessert', 'snack', 'streetFood']
const MEAL_TYPE_LABEL = {
  breakfast: '早餐', lunch: '午餐', dinner: '晚餐', dessert: '甜点', snack: '小食', streetFood: '街食',
}

const DISH_ITEMS = Object.keys(COUNTRIES).flatMap((countryKey) => {
  const c = COUNTRIES[countryKey]
  return MEAL_KEYS.map((mealKey) => {
    const meal = c[mealKey]
    return {
      id: `dish-${countryKey}-${mealKey}`,
      name: meal.en,
      cn: meal.cn,
      price: meal.price,
      unit: '份',
      img: meal.img,
      category: 'dish',
      country: countryKey,
      description: meal.story,
      stock: 50,
      mealKey,
      tags: [MEAL_TYPE_LABEL[mealKey]],
    }
  })
})

export const SHOP_ITEMS = [
  ...DISH_ITEMS,

  { id: 'ing-pasta', name: 'Fresh Pasta', cn: '手工意面', price: 28, unit: '300g', category: 'ingredient', country: 'italy', description: '意大利手工意面，新鲜制作', stock: 80, sourceMeal: '奶酪黑椒意面', tags: ['招牌'] },
  { id: 'ing-parmesan', name: 'Parmigiano Reggiano', cn: '帕玛森芝士', price: 88, unit: '200g', category: 'ingredient', country: 'italy', description: '意大利 PDO 认证帕玛森芝士', stock: 50, sourceMeal: '奶酪黑椒意面', tags: ['精品'] },
  { id: 'ing-tomato', name: 'Heirloom Tomato', cn: '有机番茄', price: 12, unit: '500g', category: 'ingredient', country: 'italy', description: '意大利传家宝番茄', stock: 200, sourceMeal: '切片披萨', tags: ['新鲜'] },
  { id: 'ing-basil', name: 'Fresh Basil', cn: '新鲜罗勒', price: 8, unit: '1把', category: 'ingredient', country: 'italy', description: '意大利罗勒', stock: 150, sourceMeal: '布拉塔橄榄', tags: ['新鲜'] },
  { id: 'ing-beef', name: 'Wagyu Beef', cn: '雪花牛肉片', price: 128, unit: '200g', category: 'ingredient', country: 'italy', description: 'A5 级雪花牛肉，薄切', stock: 40, sourceMeal: '和牛寿喜锅', tags: ['顶级'] },
  { id: 'ing-mozzarella', name: 'Fresh Mozzarella', cn: '新鲜马苏里拉', price: 48, unit: '150g', category: 'ingredient', country: 'italy', description: '意大利水牛马苏里拉', stock: 60, sourceMeal: '切片披萨', tags: ['精品'] },
  { id: 'ing-prosciutto', name: 'Prosciutto', cn: '帕尔马火腿', price: 98, unit: '100g', category: 'ingredient', country: 'italy', description: '意大利帕尔马火腿，24 个月熟成', stock: 35, tags: ['顶级'] },
  { id: 'ing-sun-dried-tomato', name: 'Sun-Dried Tomatoes', cn: '日晒番茄干', price: 35, unit: '200g', category: 'ingredient', country: 'italy', description: '西西里日晒番茄干', stock: 55, tags: ['精品'] },
  { id: 'ing-capers', name: 'Capers', cn: '刺山柑', price: 42, unit: '100g', category: 'ingredient', country: 'italy', description: '地中海刺山柑，酸香浓郁', stock: 40, tags: ['特色'] },

  { id: 'ing-ramen', name: 'Ramen Noodles', cn: '手工拉面', price: 35, unit: '2人份', category: 'ingredient', country: 'japan', description: '日本豚骨拉面专用面条', stock: 100, sourceMeal: '豚骨拉面', tags: ['经典'] },
  { id: 'ing-chashu', name: 'Chashu Pork', cn: '叉烧肉', price: 58, unit: '200g', category: 'ingredient', country: 'japan', description: '日式叉烧，慢炖入味', stock: 60, sourceMeal: '豚骨拉面', tags: [] },
  { id: 'ing-mushroom', name: 'Shiitake Mushroom', cn: '香菇', price: 15, unit: '200g', category: 'ingredient', country: 'japan', description: '日本原木香菇', stock: 180, tags: [] },
  { id: 'ing-salmon', name: 'Sockeye Salmon', cn: '三文鱼', price: 88, unit: '300g', category: 'ingredient', country: 'japan', description: '挪威三文鱼，刺身级', stock: 40, tags: ['精品'] },
  { id: 'ing-tuna', name: 'Bluefin Tuna', cn: '蓝鳍金枪鱼', price: 188, unit: '200g', category: 'ingredient', country: 'japan', description: '蓝鳍金枪鱼赤身', stock: 20, tags: ['顶级'] },
  { id: 'ing-rice', name: 'Koshihikari Rice', cn: '越光米', price: 58, unit: '2kg', category: 'ingredient', country: 'japan', description: '日本新潟越光米', stock: 80, tags: ['精品'] },
  { id: 'ing-nori', name: 'Nori Sheets', cn: '海苔片', price: 28, unit: '10张', category: 'ingredient', country: 'japan', description: '日本有明海苔', stock: 90, tags: ['精品'] },
  { id: 'ing-miso', name: 'White Miso Paste', cn: '白味噌', price: 32, unit: '500g', category: 'ingredient', country: 'japan', description: '日本信州白味噌', stock: 70, sourceMeal: '毛豆味噌汤', tags: ['特色'] },
  { id: 'ing-bonito-flakes', name: 'Bonito Flakes', cn: '柴鱼片', price: 35, unit: '1袋', category: 'ingredient', country: 'japan', description: '日本进口柴鱼片，章鱼烧必备', stock: 80, sourceMeal: '章鱼烧', tags: ['经典'] },
  { id: 'ing-octopus', name: 'Fresh Octopus', cn: '鲜活章鱼', price: 88, unit: '500g', category: 'ingredient', country: 'japan', description: '日本海域鲜活章鱼', stock: 30, sourceMeal: '章鱼烧', tags: ['新鲜'] },
  { id: 'ing-dashi-stock', name: 'Dashi Stock', cn: '出汁', price: 28, unit: '500ml', category: 'ingredient', country: 'japan', description: '日式高汤，味噌汤的基础', stock: 90, sourceMeal: '毛豆味噌汤', tags: ['经典'] },
  { id: 'ing-takoyaki-flour-mix', name: 'Takoyaki Flour Mix', cn: '章鱼烧粉', price: 25, unit: '500g', category: 'ingredient', country: 'japan', description: '手工调配章鱼烧粉（不可单独购买）', stock: 0, sourceMeal: '章鱼烧', tags: ['不可购买'], isNotPurchasable: true },

  { id: 'ing-corn-tortilla', name: 'Corn Tortillas', cn: '玉米饼', price: 22, unit: '12张', category: 'ingredient', country: 'mexico', description: '墨西哥传统玉米饼', stock: 90, sourceMeal: '比利亚肉汤塔可', tags: [] },
  { id: 'ing-avocado', name: 'Hass Avocado', cn: '鳄梨', price: 15, unit: '2个', category: 'ingredient', country: 'mexico', description: '墨西哥 Hass 鳄梨，熟透', stock: 120, sourceMeal: '鳄梨酱玉米片', tags: ['特色'] },
  { id: 'ing-beef-mex', name: 'Beef Brisket', cn: '牛胸肉', price: 68, unit: '500g', category: 'ingredient', country: 'mexico', description: '慢炖牛胸肉，适合比利亚塔可', stock: 50, sourceMeal: '比利亚肉汤塔可', tags: [] },
  { id: 'ing-lime', name: 'Key Lime', cn: '青柠', price: 18, unit: '500g', category: 'ingredient', country: 'mexico', description: '墨西哥 Key 青柠', stock: 100, sourceMeal: '鳄梨酱玉米片', tags: ['新鲜'] },
  { id: 'ing-cilantro', name: 'Fresh Cilantro', cn: '香菜', price: 6, unit: '1把', category: 'ingredient', country: 'mexico', description: '新鲜香菜', stock: 200, sourceMeal: '皮蛋豆腐', tags: ['新鲜'] },

  { id: 'ing-flour', name: 'All-Butter Flour', cn: '法式面粉', price: 18, unit: '500g', category: 'ingredient', country: 'france', description: '法国 T65 型面粉，适合甜点', stock: 70, sourceMeal: '巧克力吉拿棒', tags: [] },
  { id: 'ing-butter', name: 'Normandy Butter', cn: '诺曼底黄油', price: 45, unit: '250g', category: 'ingredient', country: 'france', description: '法国诺曼底产黄油，奶香浓郁', stock: 55, sourceMeal: '牛角包配拿铁', tags: ['精品'] },
  { id: 'ing-egg', name: 'Farm Eggs', cn: '农场鸡蛋', price: 18, unit: '10个', category: 'ingredient', country: 'france', description: '散养农场鸡蛋', stock: 160, sourceMeal: '牧场鸡蛋', tags: ['新鲜'] },
  { id: 'ing-cream', name: 'Heavy Cream', cn: '鲜奶油', price: 35, unit: '500ml', category: 'ingredient', country: 'france', description: '法国鲜奶油', stock: 60, sourceMeal: '焦糖布丁', tags: [] },
  { id: 'ing-cheese', name: 'Comté Cheese', cn: '孔泰芝士', price: 128, unit: '300g', category: 'ingredient', country: 'france', description: '法国孔泰芝士，12 个月熟成', stock: 30, tags: ['精品'] },

  { id: 'ing-rice-noodle', name: 'Rice Noodles', cn: '米粉', price: 16, unit: '400g', category: 'ingredient', country: 'thailand', description: '泰国米粉，爽滑劲道', stock: 110, sourceMeal: '泰式炒河粉', tags: [] },
  { id: 'ing-chicken', name: 'Chicken Thigh', cn: '鸡腿肉', price: 32, unit: '400g', category: 'ingredient', country: 'thailand', description: '去骨鸡腿肉', stock: 95, sourceMeal: '绿咖喱鸡', tags: [] },
  { id: 'ing-shrimp', name: 'River Prawns', cn: '河虾', price: 68, unit: '300g', category: 'ingredient', country: 'thailand', description: '泰国河虾，鲜活', stock: 45, sourceMeal: '泰式炒河粉', tags: ['精品'] },
  { id: 'ing-galangal', name: 'Galangal Root', cn: '南姜', price: 22, unit: '200g', category: 'ingredient', country: 'thailand', description: '泰国南姜，冬阴功必备', stock: 80, tags: [] },
  { id: 'ing-lemongrass', name: 'Lemongrass', cn: '香茅', price: 15, unit: '3根', category: 'ingredient', country: 'thailand', description: '泰国香茅', stock: 120, tags: ['新鲜'] },

  { id: 'ing-tofu', name: 'Silken Tofu', cn: '嫩豆腐', price: 8, unit: '1块', category: 'ingredient', country: 'china', description: '四川嫩滑豆腐', stock: 150, sourceMeal: '皮蛋豆腐', tags: [] },
  { id: 'ing-pork-mince', name: 'Ground Pork', cn: '猪肉末', price: 28, unit: '300g', category: 'ingredient', country: 'china', description: '三分肥七分瘦猪肉末', stock: 85, sourceMeal: '小笼包', tags: [] },
  { id: 'ing-scallion', name: 'Scallion', cn: '葱', price: 5, unit: '1把', category: 'ingredient', country: 'china', description: '新鲜大葱', stock: 300, sourceMeal: '煎饼', tags: ['新鲜'] },
  { id: 'ing-chili', name: 'Sichuan Chili', cn: '四川辣椒', price: 12, unit: '100g', category: 'ingredient', country: 'china', description: '四川干辣椒', stock: 180, tags: ['特色'] },
  { id: 'ing-gluten', name: 'Vital Wheat Gluten', cn: '面筋', price: 16, unit: '200g', category: 'ingredient', country: 'china', description: '小麦面筋，手工凉皮用', stock: 90, tags: [] },
  { id: 'ing-garlic', name: 'Garlic Bulb', cn: '大蒜', price: 8, unit: '3头', category: 'ingredient', country: 'china', description: '山东紫皮大蒜', stock: 250, tags: ['新鲜'] },
  { id: 'ing-onion', name: 'Yellow Onion', cn: '洋葱', price: 6, unit: '500g', category: 'ingredient', country: 'china', description: '甘肃黄洋葱', stock: 280, tags: ['新鲜'] },
  { id: 'ing-carrot', name: 'Organic Carrot', cn: '有机胡萝卜', price: 7, unit: '500g', category: 'ingredient', country: 'china', description: '内蒙古有机胡萝卜', stock: 220, tags: ['新鲜'] },
  { id: 'ing-ginger', name: 'Fresh Ginger', cn: '生姜', price: 10, unit: '200g', category: 'ingredient', country: 'china', description: '山东大姜', stock: 180, tags: ['新鲜'] },

  { id: 'cond-olive-oil', name: 'Tuscan Olive Oil', cn: '托斯卡纳橄榄油', price: 68, unit: '500ml', category: 'condiment', country: 'italy', description: '意大利托斯卡纳特级初榨橄榄油', stock: 80, tags: ['精品'] },
  { id: 'cond-soy-sauce', name: 'Artisan Soy Sauce', cn: '手工酱油', price: 45, unit: '500ml', category: 'condiment', country: 'japan', description: '日本手工酿造酱油', stock: 100, tags: ['经典'] },
  { id: 'cond-saffron', name: 'Saffron Threads', cn: '藏红花', price: 88, unit: '1g', category: 'condiment', description: '伊朗顶级藏红花', stock: 50, tags: ['稀有'] },
  { id: 'cond-truffle', name: 'Black Truffle', cn: '黑松露', price: 168, unit: '50g', category: 'condiment', country: 'france', description: '法国佩里戈尔黑松露', stock: 20, tags: ['顶级'] },
  { id: 'cond-wasabi', name: 'Fresh Wasabi', cn: '新鲜山葵', price: 58, unit: '100g', category: 'condiment', country: 'japan', description: '日本静冈新鲜山葵', stock: 40, tags: ['特色'] },
  { id: 'cond-coconut-milk', name: 'Coconut Milk', cn: '椰浆', price: 18, unit: '400ml', category: 'condiment', country: 'thailand', description: '泰国原装进口椰浆', stock: 120, tags: [] },
  { id: 'cond-balsamic', name: 'Balsamic Vinegar', cn: '黑醋', price: 78, unit: '250ml', category: 'condiment', country: 'italy', description: '意大利摩德纳黑醋', stock: 45, tags: ['精品'] },
  { id: 'cond-salsa', name: 'Salsa Verde', cn: '莎莎酱', price: 32, unit: '200ml', category: 'condiment', country: 'mexico', description: '墨西哥青莎莎酱', stock: 70, tags: ['特色'] },
  { id: 'cond-mustard', name: 'Dijon Mustard', cn: '第戎芥末', price: 42, unit: '250g', category: 'condiment', country: 'france', description: '法国第戎芥末', stock: 55, tags: ['经典'] },
  { id: 'cond-fish-sauce', name: 'Fish Sauce', cn: '鱼露', price: 28, unit: '500ml', category: 'condiment', country: 'thailand', description: '泰国鱼露，鲜味十足', stock: 90, tags: [] },
  { id: 'cond-douban', name: 'Doubanjiang', cn: '豆瓣酱', price: 38, unit: '500g', category: 'condiment', country: 'china', description: '四川郫县豆瓣酱', stock: 75, tags: ['招牌'] },
  { id: 'cond-black-pepper', name: 'Tellicherry Pepper', cn: '黑胡椒', price: 25, unit: '100g', category: 'condiment', description: '印度泰利切里黑胡椒', stock: 110, tags: [] },
  { id: 'cond-sea-salt', name: 'Sea Salt', cn: '海盐', price: 18, unit: '200g', category: 'condiment', description: '法国布列塔尼海盐', stock: 130, tags: ['精品'] },
  { id: 'cond-paprika', name: 'Smoked Paprika', cn: '烟熏甜椒粉', price: 32, unit: '100g', category: 'condiment', country: 'mexico', description: '西班牙烟熏甜椒粉', stock: 65, tags: ['特色'] },
  { id: 'cond-chili-oil', name: 'Chili Oil', cn: '辣椒油', price: 28, unit: '300ml', category: 'condiment', country: 'china', description: '四川红油辣椒油', stock: 95, tags: ['招牌'] },
  { id: 'cond-mirin', name: 'Mirin', cn: '味醂', price: 35, unit: '500ml', category: 'condiment', country: 'japan', description: '日本味醂，甜米酒', stock: 70, tags: ['经典'] },
  { id: 'cond-takoyaki-sauce', name: 'Takoyaki Sauce', cn: '章鱼烧酱', price: 28, unit: '500ml', category: 'condiment', country: 'japan', description: '日式章鱼烧酱，甜咸适中', stock: 60, sourceMeal: '章鱼烧', tags: ['特色'] },
  { id: 'cond-rice-vinegar', name: 'Rice Vinegar', cn: '米酒醋', price: 22, unit: '500ml', category: 'condiment', country: 'china', description: '镇江香醋', stock: 110, tags: [] },
  { id: 'cond-oyster-sauce', name: 'Oyster Sauce', cn: '蚝油', price: 32, unit: '500ml', category: 'condiment', country: 'china', description: '广东蚝油，鲜味浓郁', stock: 85, tags: ['经典'] },
  { id: 'cond-sesame-oil', name: 'Sesame Oil', cn: '香油', price: 28, unit: '250ml', category: 'condiment', country: 'china', description: '小磨香油，香气浓郁', stock: 100, tags: ['精品'] },
]

export const SHOP_COUNTRIES = [
  { id: 'all', name: 'All', cn: '全部', flag: '' },
  { id: 'italy', name: 'Italy', cn: '意大利', flag: '🇮🇹' },
  { id: 'japan', name: 'Japan', cn: '日本', flag: '🇯🇵' },
  { id: 'mexico', name: 'Mexico', cn: '墨西哥', flag: '🇲🇽' },
  { id: 'france', name: 'France', cn: '法国', flag: '🇫🇷' },
  { id: 'thailand', name: 'Thailand', cn: '泰国', flag: '🇹🇭' },
  { id: 'china', name: 'China', cn: '中国', flag: '🇨🇳' },
]
