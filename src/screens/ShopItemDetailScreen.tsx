import { useState, useMemo, useEffect } from 'react'
import {
  IconArrowRight, IconBookmark, IconPin, IconPlus, IconLeaf, IconFire, IconClock, IconShoppingCart, IconCheck, IconX,
  Eyebrow, Reveal,
} from '../components'
import type { ShopItem } from '../types'
import { SHOP_ITEMS, SHOP_COUNTRIES, COUNTRIES } from '../data'

// ─── 配料名匹配（排除菜品自身，允许匹配不可购买商品） ───────────────────────
function matchShopItem(ing: { n: string; t: string }): ShopItem | null {
  const needleT = ing.t.trim().toLowerCase()
  const needleN = ing.n.trim().toLowerCase()
  const keywords = needleT
    .split(/[,，]/)
    .map((s) => s.trim())
    .filter(Boolean)
  const allKeywords = [needleN, ...keywords].filter(Boolean)

  // 只排除菜品本身，保留不可购买商品用于识别
  const pool = SHOP_ITEMS.filter((s) => s.category !== 'dish')

  // 精确匹配 name 或 cn
  let hit = pool.find((s) => {
    const sn = s.name.toLowerCase()
    const sc = s.cn.toLowerCase()
    return allKeywords.some((kw) => kw === sn || kw === sc)
  })
  if (hit) return hit

  // 关键词匹配：优先可购买商品
  const purchasablePool = pool.filter((s) => !s.isNotPurchasable)
  const sortedPool = [...purchasablePool].sort((a, b) => (b.cn.length + b.name.length) - (a.cn.length + a.name.length))
  hit = sortedPool.find((s) => {
    const cn = s.cn.toLowerCase()
    const nm = s.name.toLowerCase()
    return allKeywords.some((kw) => {
      const kwClean = kw.replace(/\b(chopped|diced|sliced|ground|fresh|raw|cooked|boiled|steamed)\b/g, '').trim()
      return (cn && (kw.includes(cn) || kwClean.includes(cn) || cn.includes(kwClean))) ||
             (nm && (kw.includes(nm) || kwClean.includes(nm) || nm.includes(kwClean)))
    })
  })
  if (hit) return hit

  // 最后匹配不可购买商品
  const blockedPool = pool.filter((s) => s.isNotPurchasable)
  const sortedBlocked = [...blockedPool].sort((a, b) => (b.cn.length + b.name.length) - (a.cn.length + a.name.length))
  return sortedBlocked.find((s) => {
    const cn = s.cn.toLowerCase()
    const nm = s.name.toLowerCase()
    return allKeywords.some((kw) => {
      const kwClean = kw.replace(/\b(chopped|diced|sliced|ground|fresh|raw|cooked|boiled|steamed)\b/g, '').trim()
      return (cn && (kw.includes(cn) || kwClean.includes(cn) || cn.includes(kwClean))) ||
             (nm && (kw.includes(nm) || kwClean.includes(nm) || nm.includes(kwClean)))
    })
  }) || null
}

// ─── 通用模板文案 ─────────────────────────────────────────
function tasteReview(taste: string): string {
  const t = taste.toLowerCase()
  if (t.includes('spicy')) return '辣度层次分明，前调鲜香、后调微辣，越吃越过瘾。'
  if (t.includes('sweet')) return '甜而不腻，余味悠长，适合餐后慢慢品味。'
  if (t.includes('rich')) return '浓郁醇厚，一口满足，每一层风味都在舌尖展开。'
  if (t.includes('fresh')) return '清新爽口，原味呈现，吃得出食材本身的鲜活。'
  if (t.includes('creamy')) return '丝滑绵密，奶香四溢，入口即化的温柔触感。'
  if (t.includes('crisp')) return '外酥里嫩，口感分明，咬下去的第一口就是惊喜。'
  if (t.includes('umami') || t.includes('savory')) return '鲜味醇厚，回甘悠长，是那种让人停不下来的好味道。'
  if (t.includes('bitter')) return '苦甜交织，先苦后甘，是成熟味蕾才能体会的层次。'
  return '层次丰富，回味无穷，每一口都有新的发现。'
}

function ingredientUsage(item: ShopItem): string {
  if (item.sourceMeal) return `最适合用于「${item.sourceMeal}」，也可用于家常炒菜、汤品或沙拉，增添风味层次。`
  return '适合多种烹饪方式：炒、煮、炖、拌皆可，按个人口味适量使用。'
}

function ingredientEffect(item: ShopItem): string {
  if (item.category === 'condiment') return '少许即可提升整道菜的风味层次，是厨房里画龙点睛的秘密武器。'
  if (item.cn.includes('豆腐') || item.cn.includes('面筋')) return '富含植物蛋白，口感柔嫩易吸收，是素食者的优质蛋白来源。'
  if (item.cn.includes('肉') || item.cn.includes('牛') || item.cn.includes('鸡') || item.cn.includes('虾') || item.cn.includes('鱼')) return '优质动物蛋白来源，氨基酸丰富，适量食用有助于维持肌肉健康。'
  if (item.cn.includes('蒜') || item.cn.includes('姜') || item.cn.includes('葱') || item.cn.includes('辣椒')) return '天然提味食材，含有活性成分，适量食用有助于促进代谢、驱寒暖身。'
  if (item.cn.includes('番茄') || item.cn.includes('胡萝卜') || item.cn.includes('蔬菜') || item.cn.includes('香菜') || item.cn.includes('罗勒')) return '富含维生素与膳食纤维，清新低卡，为餐桌增添自然色彩。'
  return '营养丰富，适量食用有助于均衡膳食，为日常饮食增添多样风味。'
}

function originText(item: ShopItem): string {
  if (item.country) {
    const c = COUNTRIES[item.country]
    return `${c.name} · ${c.cn}：${item.description}`
  }
  return item.description
}

// ─── 推荐商品：同国家优先，否则同类别（随机打乱） ───────────────────
function getRecommendations(item: ShopItem, count = 4, seed = 0): ShopItem[] {
  const pool = SHOP_ITEMS.filter((x) => x.id !== item.id)
  const sameCountry = item.country ? pool.filter((x) => x.country === item.country) : []
  const sameCategory = pool.filter((x) => x.category === item.category && x.id !== item.id)
  // 简单 seeded shuffle
  const shuffle = <T,>(arr: T[]) => {
    const a = [...arr]
    let s = seed + 1
    for (let i = a.length - 1; i > 0; i--) {
      s = (s * 9301 + 49297) % 233280
      const j = Math.floor((s / 233280) * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }
  const seen = new Set<string>()
  const out: ShopItem[] = []
  for (const x of [...shuffle(sameCountry), ...shuffle(sameCategory), ...shuffle(pool)]) {
    if (!seen.has(x.id)) { seen.add(x.id); out.push(x) }
    if (out.length >= count) break
  }
  return out
}

export function ShopItemDetailScreen({
  item,
  onBack,
  onNavigate,
  onAddToCart,
  onRemoveFromCart,
  justAddedId,
  onBackToShop,
  cartItemIds,
}: {
  item: ShopItem
  onBack: () => void
  onNavigate: (item: ShopItem) => void
  onAddToCart: (item: ShopItem) => void
  onRemoveFromCart: (itemId: string) => void
  justAddedId: string | null
  onBackToShop?: () => void
  cartItemIds?: Set<string>
}) {
  const isDish = item.category === 'dish'
  const meal = isDish && item.country && item.mealKey ? COUNTRIES[item.country][item.mealKey] : null
  const [recSeed, setRecSeed] = useState(0)
  const recs = useMemo(() => getRecommendations(item, 4, recSeed), [item.id, recSeed])
  const countryData = item.country ? COUNTRIES[item.country] : null
  const [flyAnimId, setFlyAnimId] = useState<string | null>(null)
  void justAddedId

  const isInCart = (id: string) => cartItemIds?.has(id) ?? false

  const handleToggleIngredient = (m: ShopItem) => {
    if (isInCart(m.id)) {
      onRemoveFromCart(m.id)
    } else {
      onAddToCart(m)
      setFlyAnimId(m.id)
      setTimeout(() => setFlyAnimId(null), 700)
    }
  }

  const handleToggleSelf = () => {
    if (isInCart(item.id)) {
      onRemoveFromCart(item.id)
    } else {
      onAddToCart(item)
      setFlyAnimId(item.id)
      setTimeout(() => setFlyAnimId(null), 700)
    }
  }

  // ─── DISH：配料勾选状态（根据购物车自动同步） ───
  const [checked, setChecked] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (!isDish || !meal) return
    const next = new Set<number>()
    if (cartItemIds) {
      meal.recipe.ingredients.forEach((ing, i) => {
        const m = matchShopItem(ing)
        if (m && cartItemIds.has(m.id)) next.add(i)
      })
    }
    setChecked(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meal, isDish, cartItemIds])

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i); else next.add(i)
      return next
    })
  }

  const handleDishAdd = () => {
    const isDishInCart = isInCart(item.id)
    // Remove mode: dish already in cart → remove all checked ingredients + dish itself
    if (isDishInCart) {
      if (checked.size > 0) {
        meal!.recipe.ingredients.forEach((ing, i) => {
          if (checked.has(i)) {
            const m = matchShopItem(ing)
            if (m && !m.isNotPurchasable && isInCart(m.id)) {
              onRemoveFromCart(m.id)
            }
          }
        })
      }
      handleToggleSelf()
      return
    }
    // Add mode
    if (checked.size === 0) {
      handleToggleSelf()
      return
    }
    meal!.recipe.ingredients.forEach((ing, i) => {
      if (checked.has(i)) {
        const m = matchShopItem(ing)
        if (m && !m.isNotPurchasable && !isInCart(m.id)) handleToggleIngredient(m)
      }
    })
    handleToggleSelf()
  }

  const bottomCta = isDish ? handleDishAdd : handleToggleSelf
  const bottomCtaLabel = isDish
    ? (checked.size > 0 ? `Add Selected (${checked.size}) + Dish` : 'Add Dish to Cart')
    : (isInCart(item.id) ? 'Remove from Cart' : 'Add to Cart')

  return (
    <div className="h-full bg-[#F3ECE0] relative">
      <div className="h-full overflow-y-auto pb-28">

      {/* ═══════════ STICKY TOP BAR ═══════════ */}
      <div className="sticky top-0 z-50 h-0">
        <div className="absolute top-0 left-0 right-0 pt-11 px-5 flex items-center justify-between text-white">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-white/90 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] tracking-[0.2em] uppercase hover:bg-black/50 active:scale-95 transition-all"
          >
            <IconArrowRight size={12} style={{ transform: 'rotate(180deg)' }} /> Back
          </button>
          <div className="flex items-center gap-2">
            {onBackToShop && (
              <button
                onClick={onBackToShop}
                className="flex items-center gap-1 text-white/90 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] tracking-[0.2em] uppercase hover:bg-black/50 active:scale-95 transition-all"
                title="返回商品页"
              >
                More <IconArrowRight size={10} />
              </button>
            )}
            <button className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center hover:bg-black/50 active:scale-95 transition-all">
              <IconBookmark size={16} stroke="#fff" />
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative h-[380px]">
        <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-black/90" />

        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <Reveal>
            {countryData && (
              <div className="flex items-center gap-1.5 text-[9px] tracking-[0.35em] uppercase text-[#E8650A] mb-1.5">
                <IconPin size={11} /> {countryData.name} · {countryData.cn}
              </div>
            )}
            <h1 className="font-display text-[40px] font-black leading-[0.9] tracking-tight">{item.name}</h1>
            <p className="font-display italic text-white/75 text-[16px] mt-0.5">{item.cn}</p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ PRICE BAR ═══════════ */}
      <section className="px-5 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-[0_10px_30px_-12px_rgba(26,18,8,0.15)] border border-stone-200/70 px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="font-display text-[28px] font-black text-[#E8650A]">¥{item.price}</span>
              <span className="text-stone-400 text-[12px]">/ {item.unit}</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
              <IconCheck size={12} stroke="#8B6F47" /> 库存 {item.stock}
            </div>
          </div>
          {item.tags && item.tags.length > 0 && (
            <div className="mt-3 flex gap-1.5">
              {item.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-0.5 bg-[#F3ECE0] text-stone-700 text-[9px] tracking-[0.2em] uppercase font-bold rounded-full">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════ DISH: 故事 + Stats + 配料(加号) ═══════════ */}
      {isDish && meal && (
        <>
          <section className="px-5 pt-7">
            <Reveal>
              <Eyebrow num="01">The Dish</Eyebrow>
              <p className="font-display italic text-stone-800 text-[16px] leading-[1.55] mt-3">{meal.story}</p>
            </Reveal>
          </section>

          <section className="px-5 pt-6">
            <div className="bg-white rounded-2xl border border-stone-200/70 px-4 py-3.5">
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { k: meal.kcal, v: 'kcal' },
                  { k: meal.time, v: 'time' },
                  { k: meal.difficulty, v: 'level' },
                  { k: meal.taste.split('·')[0].trim(), v: 'taste' },
                ].map((m, i) => (
                  <div key={i}>
                    <p className="font-display text-[16px] font-bold text-stone-900 leading-none">{m.k}</p>
                    <p className="text-stone-500 text-[8px] tracking-[0.2em] uppercase mt-1">{m.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Ingredients with + button */}
          <section className="px-5 pt-7">
            <Reveal>
              <div className="flex items-baseline justify-between">
                <Eyebrow num="02">Ingredients</Eyebrow>
                <p className="font-display text-stone-500 text-[11px] tracking-[0.2em] uppercase">Serves 2</p>
              </div>
            </Reveal>
            <p className="mt-2 text-[10px] tracking-[0.15em] uppercase text-stone-400 flex items-center gap-1.5">
              <span className="inline-block w-3.5 h-3.5 rounded-full border-[1.5px] border-[#E8650A] flex items-center justify-center text-[#E8650A] leading-none" style={{ fontSize: '8px' }}>+</span>
              Included in dish · Tap to add extra to cart
            </p>
            <ul className="mt-3 divide-y divide-stone-300/80 border-y border-stone-300/80">
              {meal.recipe.ingredients.map((ing, i) => {
                const m = matchShopItem(ing)
                const isChecked = checked.has(i)
                const isPurchasable = m && !m.isNotPurchasable
                const inCart = m ? isInCart(m.id) : false
                return (
                  <Reveal key={i} delay={i * 50}>
                    <li className="flex items-center gap-3 py-3 group">
                      {/* 加号/移除按钮 */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          if (isPurchasable && m) {
                            if (inCart) {
                              handleToggleIngredient(m)
                            } else {
                              toggle(i)
                              handleToggleIngredient(m)
                            }
                          }
                        }}
                        disabled={!isPurchasable}
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                          !isPurchasable
                            ? 'border-stone-300 text-stone-300 cursor-not-allowed'
                            : inCart
                              ? 'bg-[#1A1208] border-[#1A1208] text-white scale-110 hover:bg-[#2A1F0F]'
                              : isChecked
                                ? 'bg-[#E8650A] border-[#E8650A] text-white scale-110'
                                : 'border-[#E8650A] text-[#E8650A] hover:bg-[#E8650A] hover:text-white active:scale-90'
                        } ${flyAnimId === m?.id ? 'animate-add-fly' : ''}`}
                      >
                        {inCart ? <IconX size={12} /> : <IconPlus size={14} />}
                      </button>
                      {/* 配料数量 */}
                      <span className="font-display text-[12px] font-bold text-stone-400 w-14 shrink-0">{ing.n}</span>
                      {/* 配料名称 */}
                      <div className="flex-1 min-w-0">
                        {isPurchasable && m ? (
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); onNavigate(m) }}
                            className="text-stone-800 text-[14px] font-bold text-left hover:text-[#E8650A] transition-colors truncate block w-full"
                          >
                            {m.cn}
                            <span className="ml-2 text-[#E8650A] text-[10px] font-normal opacity-0 group-hover:opacity-100 transition-opacity">→ 详情</span>
                          </button>
                        ) : (
                          <span className={`text-[14px] truncate block ${!isPurchasable && m?.isNotPurchasable ? 'text-stone-400' : 'text-stone-600'}`}>
                            {ing.t}
                            {m?.isNotPurchasable && <span className="ml-2 text-[10px] text-stone-400">不可购买</span>}
                          </span>
                        )}
                        {isPurchasable && m && (
                          <p className="text-stone-500 text-[10px] mt-0.5">
                            ¥{m.price} / {m.unit}
                            {inCart && <span className="ml-2 text-[#1A1208] font-bold">已加购 · 点击取消</span>}
                          </p>
                        )}
                      </div>
                    </li>
                  </Reveal>
                )
              })}
            </ul>
          </section>

          {/* Taste Review */}
          <section className="px-5 pt-7">
            <Reveal>
              <Eyebrow num="03">Tasting Notes</Eyebrow>
              <div className="mt-4 bg-[#EBE3D3] rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0">
                    <IconFire size={15} stroke="#E8650A" />
                  </div>
                  <div className="flex-1">
                    <p className="font-display italic text-[#1A1208] text-[14px] leading-[1.6]">{tasteReview(meal.taste)}</p>
                    <p className="text-stone-500 text-[10px] mt-2 tracking-[0.15em] uppercase">Flavor Profile · {meal.taste}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </section>
        </>
      )}

      {/* ═══════════ INGREDIENT/CONDIMENT: 产地+用法+效果 ═══════════ */}
      {!isDish && (
        <>
          <section className="px-5 pt-7">
            <Reveal>
              <Eyebrow num="01">Origin</Eyebrow>
              <p className="font-display italic text-stone-800 text-[16px] leading-[1.55] mt-3">{originText(item)}</p>
            </Reveal>
          </section>

          <section className="px-5 pt-7">
            <Reveal>
              <Eyebrow num="02">How to Use</Eyebrow>
              <div className="mt-4 bg-white rounded-2xl border border-stone-200/70 p-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#F3ECE0] flex items-center justify-center shrink-0">
                    <IconClock size={15} stroke="#E8650A" />
                  </div>
                  <div className="flex-1">
                    <p className="text-stone-700 text-[13px] leading-[1.6]">{ingredientUsage(item)}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </section>

          <section className="px-5 pt-5">
            <Reveal>
              <Eyebrow num="03">Why You'll Love It</Eyebrow>
              <div className="mt-4 bg-[#EBE3D3] rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0">
                    <IconLeaf size={15} stroke="#8B6F47" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[#1A1208] text-[13px] leading-[1.6]">{ingredientEffect(item)}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </section>
        </>
      )}

      {/* ═══════════ RECOMMENDATIONS ═══════════ */}
      <section className="px-5 pt-8">
        <Reveal>
          <div className="flex items-baseline justify-between">
            <Eyebrow num="04">You May Also Like</Eyebrow>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setRecSeed((s) => s + 1)}
                className="flex items-center gap-1 text-[10px] tracking-[0.2em] uppercase text-stone-500 hover:text-[#E8650A] active:scale-95 transition-all"
                title="换一批"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/>
                </svg>
                Shuffle
              </button>
              {onBackToShop && (
                <button
                  onClick={onBackToShop}
                  className="flex items-center gap-1 text-[10px] tracking-[0.2em] uppercase text-stone-500 hover:text-[#E8650A] active:scale-95 transition-all"
                >
                  More <IconArrowRight size={11} />
                </button>
              )}
            </div>
          </div>
        </Reveal>
        <div className="mt-5 grid grid-cols-2 gap-4">
          {recs.slice(0, 4).map((rec, i) => {
            const recCountry = rec.country ? COUNTRIES[rec.country] : null
            const alreadyInCart = cartItemIds?.has(rec.id)
            return (
              <Reveal key={rec.id} delay={i * 60}>
                <button
                  onClick={() => onNavigate(rec)}
                  className="group relative w-full text-left active:scale-95 transition-transform duration-200"
                >
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-stone-100 shadow-sm ring-1 ring-stone-200/60">
                    <img
                      src={rec.img}
                      alt={rec.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-110 group-hover:saturate-105"
                      onError={(e) => {
                        const el = e.currentTarget
                        if (!el.dataset.fallback) {
                          el.dataset.fallback = '1'
                          el.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%22%20viewBox%3D%220%200%20400%20400%22%3E%3Crect%20width%3D%22400%22%20height%3D%22400%22%20fill%3D%22%23e7e5e4%22%2F%3E%3Ctext%20x%3D%22200%22%20y%3D%22210%22%20font-size%3D%2248%22%20text-anchor%3D%22middle%22%3E🍽%3C%2Ftext%3E%3C%2Fsvg%3E'
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <div className="w-full flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <IconShoppingCart size={11} stroke="#fff" />
                          <span className="text-white text-[10px] font-bold tracking-wider uppercase">View</span>
                        </div>
                        <IconArrowRight size={12} stroke="#fff" />
                      </div>
                    </div>
                    {recCountry && (
                      <span className="absolute top-2 left-2 w-6 h-6 bg-white/95 rounded-full flex items-center justify-center text-[10px] shadow-sm backdrop-blur">
                        {SHOP_COUNTRIES.find((c) => c.id === rec.country)?.flag}
                      </span>
                    )}
                    {alreadyInCart && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 bg-[#1A1208] text-white text-[9px] font-bold tracking-wider rounded-full shadow-sm backdrop-blur">
                        IN CART
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-baseline justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-[12px] font-bold text-stone-900 leading-tight line-clamp-1 group-hover:text-[#E8650A] transition-colors">{rec.name}</p>
                      <p className="text-stone-400 text-[10px] mt-0.5 line-clamp-1">{rec.cn}</p>
                    </div>
                    <p className="font-display text-[13px] font-black text-[#E8650A] whitespace-nowrap">¥{rec.price}</p>
                  </div>
                </button>
              </Reveal>
            )
          })}
        </div>
      </section>

      </div>
      {/* ─── end scroll ─── */}

      {/* ═══════════ FIXED ADD-TO-CART BAR ═══════════ */}
      <div className="absolute bottom-0 left-0 right-0 z-30 px-4 pb-5 pt-3 bg-gradient-to-t from-[#F3ECE0] via-[#F3ECE0]/95 to-transparent">
        <button
          onClick={bottomCta}
          className={`w-full py-4 rounded-2xl text-[11px] tracking-[0.3em] uppercase font-bold flex items-center justify-center gap-2.5 transition-all duration-300 active:scale-[0.98] ${
            isInCart(item.id)
              ? 'bg-[#1A1208] text-[#E8650A] shadow-lg shadow-stone-900/30'
              : 'bg-[#1A1208] text-[#E8650A] hover:bg-[#2A1F0F] shadow-lg shadow-stone-900/20'
          }`}
        >
          {isInCart(item.id) ? (
            <>
              <IconX size={14} /> Remove from Cart
            </>
          ) : (
            <>
              <IconPlus size={15} /> {bottomCtaLabel}
            </>
          )}
        </button>
      </div>
    </div>
  )
}