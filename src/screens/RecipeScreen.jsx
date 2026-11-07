import { useState } from 'react'
import {
  IconArrowRight, IconBookmark, IconPin, IconPlus, IconChef, IconX,
  Eyebrow, Reveal, FallbackImage, MealStats,
} from '../components'
import { matchShopItem, findDishShopItem } from '../lib/matchShopItem'

export function RecipeScreen({
  meal,
  country,
  onBack,
  onAddToCart,
  onRemoveFromCart,
  onOpenShopItem,
  cartItemIds,
  onToggleCart,
}) {
  const [showModal, setShowModal] = useState(false)
  const [flyAnimId, setFlyAnimId] = useState(null)

  const isInCart = (id) => cartItemIds.has(id)
  const dishShopItem = findDishShopItem(meal)

  const addedCount = meal.recipe.ingredients.filter((ingredient) => {
    const match = matchShopItem(ingredient)
    return match && !match.isNotPurchasable && isInCart(match.id)
  }).length

  const handleToggleItem = (item) => {
    if (isInCart(item.id)) {
      onRemoveFromCart(item.id)
      return
    }
    onAddToCart(item)
    setFlyAnimId(item.id)
    window.setTimeout(() => setFlyAnimId(null), 700)
  }

  const handleBuyAll = () => {
    if (addedCount > 0) {
      onToggleCart()
      return
    }
    const availableIngredients = meal.recipe.ingredients.filter((ingredient) => {
      const match = matchShopItem(ingredient)
      return match && !match.isNotPurchasable
    })
    if (availableIngredients.length === 0) {
      setShowModal(true)
      return
    }
    availableIngredients.forEach((ingredient) => {
      const match = matchShopItem(ingredient)
      if (match && !match.isNotPurchasable) handleToggleItem(match)
    })
    window.setTimeout(onToggleCart, 800)
  }

  const confirmBuyWhole = () => {
    setShowModal(false)
    if (dishShopItem) {
      handleToggleItem(dishShopItem)
      return
    }
    meal.recipe.ingredients.forEach((ingredient) => {
      const match = matchShopItem(ingredient)
      if (match && !match.isNotPurchasable && !isInCart(match.id)) handleToggleItem(match)
    })
  }

  return (
    <div className="h-full bg-[#F3ECE0] relative">
      <div className="h-full overflow-y-auto pb-28">
        <div className="sticky top-0 z-50 h-0">
          <div className="absolute top-0 left-0 right-0 pt-11 px-5 flex items-center justify-between text-white">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-white/90 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] tracking-[0.2em] hover:bg-black/50 active:scale-95 transition-all"
            >
              <IconArrowRight size={12} style={{ transform: 'rotate(180deg)' }} /> 返回
            </button>
            <button
              className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center hover:bg-black/50 active:scale-95 transition-all"
              aria-label="收藏"
            >
              <IconBookmark size={16} stroke="#fff" />
            </button>
          </div>
        </div>

        <section className="relative h-[380px]">
          <FallbackImage src={meal.img} alt={meal.cn} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-black/90" />

          <div className="absolute bottom-0 left-0 right-0 p-5 pb-14 text-white">
            <Reveal>
              <div className="flex items-center gap-1.5 text-[9px] tracking-[0.3em] uppercase text-[#E8650A] mb-1.5">
                <IconPin size={11} /> {country.cn} · {country.name}
              </div>
              <h1 className="font-display text-[44px] font-black leading-[0.92] tracking-tight">{meal.cn}</h1>
              <p className="font-display italic text-white/75 text-[16px] mt-0.5">{meal.en}</p>
            </Reveal>
          </div>
        </section>

        <section className="px-5 -mt-8 relative z-10">
          <div className="bg-white rounded-2xl shadow-[0_10px_30px_-12px_rgba(26,18,8,0.15)] border border-stone-200/70 px-5 py-4">
            <MealStats meal={meal} showMacros />
          </div>
        </section>

        <section className="px-5 pt-7">
          <Reveal>
            <Eyebrow num="01">这道菜</Eyebrow>
            <p className="font-display italic text-stone-800 text-[18px] leading-[1.6] mt-3">{meal.story}</p>
            <a
              href="#method"
              className="inline-flex items-center gap-1.5 mt-3 text-[10px] tracking-[0.2em] uppercase text-[#E8650A] hover:text-[#C44F00] active:scale-95 transition-all"
            >
              开始烹饪
              <IconArrowRight size={10} />
            </a>
          </Reveal>
        </section>

        <section className="px-5 pt-7">
          <Reveal>
            <div className="flex items-baseline justify-between">
              <Eyebrow num="02">食材</Eyebrow>
              <p className="font-display text-stone-500 text-[11px] tracking-[0.15em]">2 人份</p>
            </div>
          </Reveal>
          <ul className="mt-3 divide-y divide-stone-300/80 border-y border-stone-300/80">
            {meal.recipe.ingredients.map((ingredient, index) => {
              const match = matchShopItem(ingredient)
              const inCart = match ? isInCart(match.id) : false
              const isPurchasable = match && !match.isNotPurchasable
              return (
                <Reveal key={index} delay={index * 50}>
                  <li className="flex items-center gap-3 py-3 group">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault()
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
                      aria-label={inCart ? `移出购物车：${match?.cn}` : `加入购物车：${match?.cn || ingredient.t}`}
                    >
                      {inCart ? <IconX size={12} /> : <IconPlus size={14} />}
                    </button>
                    <span className="font-display text-[12px] font-bold text-stone-400 w-14 shrink-0">{ingredient.n}</span>
                    <div className="flex-1 min-w-0">
                      {isPurchasable && match ? (
                        <button
                          type="button"
                          onClick={(event) => { event.preventDefault(); onOpenShopItem(match) }}
                          className="text-stone-800 text-[14px] font-bold text-left hover:text-[#E8650A] transition-colors truncate block w-full"
                        >
                          {match.cn}
                        </button>
                      ) : (
                        <span className={`text-[14px] truncate block ${match?.isNotPurchasable ? 'text-stone-400' : 'text-stone-600'}`}>
                          {ingredient.t}
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

        <section id="method" className="px-5 pt-7">
          <Reveal>
            <div className="flex items-end justify-between gap-3">
              <div>
                <Eyebrow num="03">做法</Eyebrow>
                <h3 className="font-display text-[26px] font-black leading-none text-stone-900 mt-3">这样做</h3>
              </div>
              {dishShopItem && (
                <button
                  type="button"
                  onClick={(event) => { event.preventDefault(); onOpenShopItem(dishShopItem) }}
                  className="shrink-0 flex items-center gap-1 text-[12px] font-bold tracking-wide text-[#E8650A] hover:text-[#C44F00] active:scale-95 transition-all whitespace-nowrap"
                >
                  不想做，直接买
                  <IconArrowRight size={14} />
                </button>
              )}
            </div>
          </Reveal>
          <ol className="mt-5 space-y-4">
            {meal.recipe.steps.map((step, index) => (
              <Reveal key={index} delay={index * 80}>
                <li className="flex gap-3.5">
                  <span className="font-display text-[22px] font-bold text-[#E8650A]/80 leading-none shrink-0 w-5 text-right tabular-nums">{step.n}</span>
                  <div className="flex-1 border-l-2 border-stone-300/70 pl-4">
                    <h4 className="font-display text-[16px] font-bold text-stone-900 leading-snug">{step.t}</h4>
                    <p className="text-stone-600 text-[13px] mt-1 leading-relaxed">{step.d}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        <section className="px-5 pt-7 space-y-4">
          <div className="bg-[#EBE3D3] rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0">
                <IconChef size={15} stroke="#E8650A" />
              </div>
              <div className="flex-1">
                <p className="font-display italic text-[#1A1208] text-[14px] leading-[1.6]">
                  尝一口，调一下，再尝一口。菜谱只是一张地图，你的炉火和舌头才是指南针。
                </p>
                <p className="text-stone-500 text-[10px] mt-2 tracking-[0.15em] uppercase">主厨提示</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-30 px-4 pb-5 pt-3 bg-gradient-to-t from-[#F3ECE0] via-[#F3ECE0]/95 to-transparent">
        <button
          onClick={handleBuyAll}
          className="w-full py-3.5 rounded-2xl text-[12px] tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-lg bg-[#1A1208] text-[#E8650A] hover:bg-[#2A1F08] shadow-stone-900/20 active:scale-[0.98]"
        >
          {addedCount > 0 ? `查看购物车（${addedCount}）→` : '一键购买食材 →'}
        </button>
      </div>

      {showModal && (
        <>
          <div className="absolute inset-0 z-50 bg-black/45 backdrop-blur-sm animate-fade-in" onClick={() => setShowModal(false)} />
          <div className="absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-6 shadow-2xl animate-pop-in w-[340px]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[9px] tracking-[0.25em] uppercase text-stone-400 mb-1">Confirm</p>
                <h3 className="font-display text-[22px] font-black text-stone-900 leading-tight">购买整份套餐？</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-stone-100 text-stone-500 transition-colors"
                aria-label="关闭"
              >
                <IconX size={14} />
              </button>
            </div>
            <p className="text-stone-600 text-[13px] leading-relaxed mb-5">
              这道菜暂时没有可单独购买的食材。要不要直接买一份 <span className="font-bold text-[#E8650A]">{meal.cn}</span>？
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-2xl bg-stone-100 text-stone-700 text-[12px] tracking-[0.15em] font-bold hover:bg-stone-200 active:scale-[0.98] transition-all"
              >
                再想想
              </button>
              <button
                onClick={confirmBuyWhole}
                className="flex-1 py-3 rounded-2xl bg-[#E8650A] text-white text-[12px] tracking-[0.15em] font-bold hover:bg-[#D45A09] active:scale-[0.98] transition-all shadow-md shadow-[#E8650A]/30"
              >
                确认 · ¥{dishShopItem?.price ?? meal.price}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
