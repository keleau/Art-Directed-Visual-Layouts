import { useState } from 'react'
import {
  IconArrowRight, IconBookmark, IconPin, IconPlus, IconChef, IconX,
  Eyebrow, Reveal,
} from '../components'
import { type Meal, type CountryData } from '../data'
import type { ShopItem } from '../types'
import { SHOP_ITEMS } from '../data'

// 配料名匹配：排除菜品自身，允许匹配不可购买商品（用于显示"不可购买"标签）
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

export function RecipeScreen({
  meal,
  country,
  onBack,
  onAddToCart,
  onRemoveFromCart,
  onOpenShopItem,
  cartItemIds,
  onToggleCart,
}: {
  meal: Meal
  country: CountryData
  onBack: () => void
  onAddToCart: (item: ShopItem) => void
  onRemoveFromCart: (itemId: string) => void
  onOpenShopItem: (item: ShopItem) => void
  cartItemIds: Set<string>
  onToggleCart: () => void
}) {
  const macros = meal.macros
  const [showModal, setShowModal] = useState(false)
  const [flyAnimId, setFlyAnimId] = useState<string | null>(null)

  const isInCart = (id: string) => cartItemIds.has(id)

  // 计算这道菜的配料中已加购的数量
  const addedCount = meal.recipe.ingredients.filter((ing) => {
    const m = matchShopItem(ing)
    return m && !m.isNotPurchasable && isInCart(m.id)
  }).length

  const handleToggleItem = (item: ShopItem) => {
    if (isInCart(item.id)) {
      onRemoveFromCart(item.id)
    } else {
      onAddToCart(item)
      setFlyAnimId(item.id)
      setTimeout(() => setFlyAnimId(null), 700)
    }
  }

  const dishShopItem = SHOP_ITEMS.find(
    (s) => s.category === 'dish' && s.cn === meal.cn && s.country === country.name.toLowerCase()
  ) || SHOP_ITEMS.find(
    (s) => s.category === 'dish' && s.name.toLowerCase() === meal.en.toLowerCase()
  )

  const handleBuyAll = () => {
    if (addedCount > 0) {
      // 已经有配料在购物车了 → 直接展开购物车去结算
      onToggleCart()
      return
    }
    // 还没有配料加入 → 购买所有可购买的配料
    const availableIngredients = meal.recipe.ingredients.filter((ing) => {
      const m = matchShopItem(ing)
      return m && !m.isNotPurchasable
    })
    const totalPurchasable = availableIngredients.length

    if (totalPurchasable === 0) {
      setShowModal(true)
      return
    }
    availableIngredients.forEach((ing) => {
      const m = matchShopItem(ing)
      if (m && !m.isNotPurchasable) handleToggleItem(m)
    })
    // 购买后自动展开购物车
    setTimeout(() => onToggleCart(), 800)
  }

  const confirmBuyWhole = () => {
    setShowModal(false)
    if (dishShopItem) {
      handleToggleItem(dishShopItem)
    } else {
      meal.recipe.ingredients.forEach((ing) => {
        const m = matchShopItem(ing)
        if (m && !m.isNotPurchasable && !isInCart(m.id)) handleToggleItem(m)
      })
    }
  }

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
          <button className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center hover:bg-black/50 active:scale-95 transition-all">
            <IconBookmark size={16} stroke="#fff" />
          </button>
        </div>
      </div>

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative h-[380px]">
        <img src={meal.img} alt={meal.en} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-black/90" />

        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <Reveal>
            <div className="flex items-center gap-1.5 text-[9px] tracking-[0.35em] uppercase text-[#E8650A] mb-1.5">
              <IconPin size={11} /> {country.name} · {country.cn}
            </div>
            <h1 className="font-display text-[44px] font-black leading-[0.9] tracking-tight">{meal.en}</h1>
            <p className="font-display italic text-white/75 text-[16px] mt-0.5">{meal.cn}</p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ FLOATING STATS BAR ═══════════ */}
      <section className="px-5 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-[0_10px_30px_-12px_rgba(26,18,8,0.15)] border border-stone-200/70 px-5 py-4">
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { k: meal.kcal, v: 'kcal' },
              { k: meal.time, v: 'time' },
              { k: meal.difficulty, v: 'level' },
              { k: meal.taste.split('·')[0].trim(), v: 'taste' },
            ].map((m, i) => (
              <div key={i}>
                <p className="font-display text-[20px] font-bold text-stone-900 leading-none">{m.k}</p>
                <p className="text-stone-500 text-[8px] tracking-[0.25em] uppercase mt-1.5">{m.v}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-stone-200 grid grid-cols-3 gap-3 text-center">
            {[
              { k: macros.protein, v: 'Protein', c: 'text-[#E8650A]' },
              { k: macros.carbs,   v: 'Carbs',   c: 'text-[#8B6F47]' },
              { k: macros.fats,    v: 'Fats',    c: 'text-[#7A5C3E]' },
            ].map((m, i) => (
              <div key={i}>
                <p className={`font-display text-[14px] font-bold leading-none ${m.c}`}>{m.k}</p>
                <p className="text-stone-500 text-[8px] tracking-[0.2em] uppercase mt-1">{m.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ STORY ═══════════ */}
      <section className="px-5 pt-7">
        <Reveal>
          <Eyebrow num="01">The Dish</Eyebrow>
          <p className="font-display italic text-stone-800 text-[18px] leading-[1.55] mt-3">{meal.story}</p>
          <a
            href="#method"
            className="inline-flex items-center gap-1.5 mt-3 text-[10px] tracking-[0.25em] uppercase text-[#E8650A] hover:text-[#C44F00] active:scale-95 transition-all"
          >
            Start Cooking
            <IconArrowRight size={10} />
          </a>
        </Reveal>
      </section>

      {/* ═══════════ INGREDIENTS ═══════════ */}
      <section className="px-5 pt-7">
        <Reveal>
          <div className="flex items-baseline justify-between">
            <Eyebrow num="02">Ingredients</Eyebrow>
            <p className="font-display text-stone-500 text-[11px] tracking-[0.2em] uppercase">Serves 2</p>
          </div>
        </Reveal>
        <ul className="mt-3 divide-y divide-stone-300/80 border-y border-stone-300/80">
          {meal.recipe.ingredients.map((ing, i) => {
            const match = matchShopItem(ing)
            const inCart = match ? isInCart(match.id) : false
            const isPurchasable = match && !match.isNotPurchasable
            return (
              <Reveal key={i} delay={i * 50}>
                <li className="flex items-center gap-3 py-3 group">
                  {/* 加号/移除按钮 */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      if (isPurchasable && match) handleToggleItem(match)
                    }}
                    disabled={!isPurchasable}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                      !isPurchasable
                        ? 'border-stone-300 text-stone-300 cursor-not-allowed'
                        : inCart
                          ? 'bg-[#1A1208] border-[#1A1208] text-white scale-110 hover:bg-[#2A1F0F]'
                          : 'border-[#E8650A] text-[#E8650A] hover:bg-[#E8650A] hover:text-white active:scale-90'
                    } ${flyAnimId === match?.id ? 'animate-add-fly' : ''}`}
                  >
                    {inCart ? <IconX size={12} /> : <IconPlus size={14} />}
                  </button>
                  {/* 配料数量（原菜谱） */}
                  <span className="font-display text-[12px] font-bold text-stone-400 w-14 shrink-0">{ing.n}</span>
                  {/* 配料名称 */}
                  <div className="flex-1 min-w-0">
                    {isPurchasable && match ? (
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); onOpenShopItem(match) }}
                        className="text-stone-800 text-[14px] font-bold text-left hover:text-[#E8650A] transition-colors truncate block w-full"
                      >
                        {match.cn}
                      </button>
                    ) : (
                      <span className={`text-[14px] truncate block ${!isPurchasable && match?.isNotPurchasable ? 'text-stone-400' : 'text-stone-600'}`}>
                        {ing.t}
                        {match?.isNotPurchasable && <span className="ml-2 text-[10px] text-stone-400">不可购买</span>}
                      </span>
                    )}
                  </div>
                </li>
              </Reveal>
            )
          })}
        </ul>
      </section>

      {/* ═══════════ METHOD ═══════════ */}
      <section id="method" className="px-5 pt-7">
        <Reveal>
          <div className="flex items-end justify-between gap-3">
            <div>
              <Eyebrow num="03">Method</Eyebrow>
              <h3 className="font-display text-[26px] font-black leading-none text-stone-900 mt-3">How to make it</h3>
            </div>
            {dishShopItem && (
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); onOpenShopItem(dishShopItem) }}
                className="shrink-0 flex items-center gap-1 text-[12px] font-bold tracking-wide text-[#E8650A] hover:text-[#C44F00] active:scale-95 transition-all whitespace-nowrap"
              >
                不想做，直接买
                <IconArrowRight size={14} />
              </button>
            )}
          </div>
        </Reveal>
        <ol className="mt-5 space-y-4">
          {meal.recipe.steps.map((s, i) => (
            <Reveal key={i} delay={i * 80}>
              <li className="flex gap-3.5">
                <span className="font-display text-[22px] font-bold text-[#E8650A]/80 leading-none shrink-0 w-5 text-right tabular-nums">{s.n}</span>
                <div className="flex-1 border-l-2 border-stone-300/70 pl-4">
                  <h4 className="font-display text-[16px] font-bold text-stone-900 leading-snug">{s.t}</h4>
                  <p className="text-stone-600 text-[13px] mt-1 leading-relaxed">{s.d}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ═══════════ CHEF TIP ═══════════ */}
      <section className="px-5 pt-7 space-y-4">
        <div className="bg-[#EBE3D3] rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0">
              <IconChef size={15} stroke="#E8650A" />
            </div>
            <div className="flex-1">
              <p className="font-display italic text-[#1A1208] text-[14px] leading-[1.55]">
                Taste, adjust, taste again. A recipe is a map — your stove and your palate are the compass.
              </p>
              <p className="text-stone-500 text-[10px] mt-2 tracking-[0.15em] uppercase">Chef's Tip</p>
            </div>
          </div>
        </div>
      </section>

      </div>
      {/* ─── end scroll ─── */}

      {/* ═══════════ FIXED BUY BAR ═══════════ */}
      <div className="absolute bottom-0 left-0 right-0 z-30 px-4 pb-5 pt-3 bg-gradient-to-t from-[#F3ECE0] via-[#F3ECE0]/95 to-transparent">
        <button
          onClick={handleBuyAll}
          className={`w-full py-3.5 rounded-2xl text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-2 transition-all shadow-lg ${
            addedCount > 0
              ? 'bg-[#1A1208] text-[#E8650A] shadow-stone-900/30'
              : 'bg-[#1A1208] text-[#E8650A] hover:bg-[#2A1F08] shadow-stone-900/20'
          } active:scale-[0.98]`}
        >
          {addedCount > 0 ? `View Cart (${addedCount}) →` : 'Shop Ingredients →'}
        </button>
      </div>

      {/* ═══════════ 确认弹窗 ═══════════ */}
      {showModal && (
        <>
          <div
            className="absolute inset-0 z-50 bg-black/45 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowModal(false)}
          />
          <div className="absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-6 shadow-2xl animate-pop-in w-[340px]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[9px] tracking-[0.3em] uppercase text-stone-400 mb-1">Confirm</p>
                <h3 className="font-display text-[22px] font-black text-stone-900 leading-tight">购买整份套餐？</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-stone-100 text-stone-500 transition-colors"
              >
                <IconX size={14} />
              </button>
            </div>
            <p className="text-stone-600 text-[13px] leading-relaxed mb-5">
              没有可单独购买的配料。是否直接购买整份 <span className="font-bold text-[#E8650A]">{meal.cn}</span> 套餐？
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-2xl bg-stone-100 text-stone-700 text-[10px] tracking-[0.25em] uppercase font-bold hover:bg-stone-200 active:scale-[0.98] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmBuyWhole}
                className="flex-1 py-3 rounded-2xl bg-[#E8650A] text-white text-[10px] tracking-[0.25em] uppercase font-bold hover:bg-[#D45A09] active:scale-[0.98] transition-all shadow-md shadow-[#E8650A]/30"
              >
                Confirm · ¥{dishShopItem?.price ?? meal.price}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}