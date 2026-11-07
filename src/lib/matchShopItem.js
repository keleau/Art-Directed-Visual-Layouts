import { SHOP_ITEMS } from '../data'

const MODIFIER_RE = /(chopped|diced|sliced|ground|fresh|raw|cooked|boiled|steamed|rehydrated|toasted|crushed|halved|split|peeled|pre-soaked|store-bought|homemade|optional|for frying|for dusting|for dipping|pre-cooked|骨|去骨|新鲜|切碎|切片|切丁|剁碎|研磨|烤过|熟|生|整|半|适量|可选)/g

const normalize = (value) => value.trim().toLowerCase()
const clean = (value) => normalize(value.replace(MODIFIER_RE, ''))

const DISH_EXCLUDED = SHOP_ITEMS.filter((item) => item.category !== 'dish')
const PURCHASABLE = DISH_EXCLUDED.filter((item) => !item.isNotPurchasable)
const BLOCKED = DISH_EXCLUDED.filter((item) => item.isNotPurchasable)

function keywordsFor(ingredient) {
  const parts = [ingredient.n, ...ingredient.t.split(/[,，、+]/)]
  return parts.map(normalize).filter(Boolean)
}

function isFalsePositive(keyword, item) {
  if (item.cn === '米粉' && /糯米|粘米/.test(keyword)) return true
  if (/橄榄/.test(keyword) && !/橄榄油/.test(keyword) && /橄榄油/.test(item.cn)) return true
  return false
}

function findInPool(pool, keywords) {
  const exact = pool.find((item) => keywords.some((kw) => kw === normalize(item.cn) || kw === normalize(item.name)))
  if (exact) return exact

  const sorted = [...pool].sort((a, b) => b.cn.length + b.name.length - (a.cn.length + a.name.length))
  return sorted.find((item) => {
    const cn = normalize(item.cn)
    const en = normalize(item.name)
    return keywords.some((kw) => {
      const kwClean = clean(kw)
      if (!kwClean || isFalsePositive(kw, item)) return false
      const bothChili = kw.includes('辣椒') && cn.includes('辣椒')
      return bothChili
        || (cn && (kw.includes(cn) || kwClean.includes(cn) || cn.includes(kwClean)))
        || (en && (kw.includes(en) || kwClean.includes(en) || en.includes(kwClean)))
    })
  }) || null
}

/** 把菜谱配料匹配到商城商品；优先可购买商品，最后才匹配不可购买商品。 */
export function matchShopItem(ingredient) {
  const keywords = keywordsFor(ingredient)
  return findInPool(PURCHASABLE, keywords) || findInPool(BLOCKED, keywords)
}

export function findDishShopItem(meal) {
  return SHOP_ITEMS.find(
    (item) => item.category === 'dish' && item.cn === meal.cn && item.name === meal.en,
  ) || SHOP_ITEMS.find((item) => item.category === 'dish' && item.cn === meal.cn) || null
}
