import { useEffect, useMemo, useState } from 'react'
import {
  IconArrowRight, IconBookmark, IconPin, IconPlus, IconLeaf, IconFire, IconClock, IconShoppingCart, IconCheck, IconX,
  Eyebrow, Reveal, FallbackImage, MealStats, ProductArtwork,
} from '../components'
import { SHOP_ITEMS, SHOP_COUNTRIES, COUNTRIES } from '../data'
import { matchShopItem } from '../lib/matchShopItem'

function tasteReview(taste) {
  const text = taste.toLowerCase()
  if (text.includes('辣')) return '辣度层次分明，前调鲜香、后调微辣，越吃越过瘾。'
  if (text.includes('甜')) return '甜而不腻，余味悠长，适合餐后慢慢品味。'
  if (text.includes('浓') || text.includes('醇')) return '浓郁醇厚，一口满足，每一层风味都在舌尖展开。'
  if (text.includes('清') || text.includes('鲜')) return '清新爽口，原味呈现，吃得出食材本身的鲜活。'
  if (text.includes('奶') || text.includes('绵')) return '丝滑绵密，奶香四溢，入口即化的温柔触感。'
  if (text.includes('酥') || text.includes('脆')) return '外酥里嫩，口感分明，咬下去的第一口就是惊喜。'
  if (text.includes('苦')) return '苦甜交织，先苦后甘，是成熟味蕾才能体会的层次。'
  return '层次丰富，回味无穷，每一口都有新的发现。'
}

function ingredientUsage(item) {
  if (item.sourceMeal) return `最适合用来做「${item.sourceMeal}」，也可以放进家常炒菜、汤品或沙拉，给味道多一层变化。`
  return '炒、煮、炖、拌都合适，按自己的口味酌量使用。'
}

function ingredientEffect(item) {
  if (item.category === 'condiment') return '只需少许，就能把整道菜的风味提起来，是厨房里画龙点睛的那一笔。'
  if (item.cn.includes('豆腐') || item.cn.includes('面筋')) return '富含植物蛋白，口感柔嫩好吸收，是素食者的优质蛋白来源。'
  if (item.cn.includes('肉') || item.cn.includes('牛') || item.cn.includes('鸡') || item.cn.includes('虾') || item.cn.includes('鱼')) return '优质动物蛋白来源，氨基酸丰富，适量食用有助于维持肌肉健康。'
  if (item.cn.includes('蒜') || item.cn.includes('姜') || item.cn.includes('葱') || item.cn.includes('辣椒')) return '天然提味食材，含有活性成分，适量食用有助于促进代谢、驱寒暖身。'
  if (item.cn.includes('番茄') || item.cn.includes('胡萝卜') || item.cn.includes('蔬菜') || item.cn.includes('香菜') || item.cn.includes('罗勒')) return '富含维生素与膳食纤维，清新低卡，为餐桌添一点自然颜色。'
  return '营养丰富，适量食用有助于均衡膳食，为日常饮食增添多样风味。'
}

function originText(item) {
  if (item.country) {
    const country = COUNTRIES[item.country]
    return `${country.cn} · ${country.name}：${item.description}`
  }
  return item.description
}

function getRecommendations(item, count = 4, seed = 0) {
  const pool = SHOP_ITEMS.filter((candidate) => candidate.id !== item.id)
  const sameCountry = item.country ? pool.filter((candidate) => candidate.country === item.country) : []
  const sameCategory = pool.filter((candidate) => candidate.category === item.category)

  const shuffle = (list) => {
    const array = [...list]
    let state = seed + 1
    for (let index = array.length - 1; index > 0; index--) {
      state = (state * 9301 + 49297) % 233280
      const swapIndex = Math.floor((state / 233280) * (index + 1))
      ;[array[index], array[swapIndex]] = [array[swapIndex], array[index]]
    }
    return array
  }

  const seen = new Set()
  const output = []
  for (const candidate of [...shuffle(sameCountry), ...shuffle(sameCategory), ...shuffle(pool)]) {
    if (!seen.has(candidate.id)) {
      seen.add(candidate.id)
      output.push(candidate)
    }
    if (output.length >= count) break
  }
  return output
}

export function ShopItemDetailScreen({
  item,
  onBack,
  onNavigate,
  onAddToCart,
  onRemoveFromCart,
  onBackToShop,
  cartItemIds,
}) {
  const isDish = item.category === 'dish'
  const meal = isDish && item.country && item.mealKey ? COUNTRIES[item.country][item.mealKey] : null
  const [recSeed, setRecSeed] = useState(0)
  const [flyAnimId, setFlyAnimId] = useState(null)
  const [checked, setChecked] = useState(new Set())

  const recs = useMemo(() => getRecommendations(item, 4, recSeed), [item, recSeed])
  const countryData = item.country ? COUNTRIES[item.country] : null
  const isInCart = (id) => cartItemIds?.has(id) ?? false

  useEffect(() => {
    if (!isDish || !meal) return
    const next = new Set()
    if (cartItemIds) {
      meal.recipe.ingredients.forEach((ingredient, index) => {
        const match = matchShopItem(ingredient)
        if (match && cartItemIds.has(match.id)) next.add(index)
      })
    }
    setChecked(next)
  }, [meal, isDish, cartItemIds])

  const toggle = (index) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  const toggleItem = (target) => {
    if (isInCart(target.id)) {
      onRemoveFromCart(target.id)
      return
    }
    onAddToCart(target)
    setFlyAnimId(target.id)
    window.setTimeout(() => setFlyAnimId(null), 700)
  }

  const handleDishAdd = () => {
    if (isInCart(item.id)) {
      meal.recipe.ingredients.forEach((ingredient, index) => {
        if (!checked.has(index)) return
        const match = matchShopItem(ingredient)
        if (match && !match.isNotPurchasable && isInCart(match.id)) onRemoveFromCart(match.id)
      })
      toggleItem(item)
      return
    }
    if (checked.size === 0) {
      toggleItem(item)
      return
    }
    meal.recipe.ingredients.forEach((ingredient, index) => {
      if (!checked.has(index)) return
      const match = matchShopItem(ingredient)
      if (match && !match.isNotPurchasable && !isInCart(match.id)) toggleItem(match)
    })
    toggleItem(item)
  }

  const bottomCta = isDish ? handleDishAdd : () => toggleItem(item)
  const bottomCtaLabel = isDish
    ? (checked.size > 0 ? `加购已选（${checked.size}）项 + 整道菜` : '把整道菜加入购物车')
    : (isInCart(item.id) ? '从购物车移除' : '加入购物车')

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
            <div className="flex items-center gap-2">
              {onBackToShop && (
                <button
                  onClick={onBackToShop}
                  className="flex items-center gap-1 text-white/90 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] tracking-[0.2em] hover:bg-black/50 active:scale-95 transition-all"
                >
                  更多 <IconArrowRight size={10} />
                </button>
              )}
              <button
                className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center hover:bg-black/50 active:scale-95 transition-all"
                aria-label="收藏"
              >
                <IconBookmark size={16} stroke="#fff" />
              </button>
            </div>
          </div>
        </div>

        <section className="relative h-[380px]">
          {isDish ? (
            <FallbackImage src={item.img} alt={item.cn} className="w-full h-full object-cover" />
          ) : (
            <ProductArtwork item={item} variant="hero" className="w-full h-full" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/5 to-black/75" />

          <div className="absolute bottom-0 left-0 right-0 p-5 pb-14 text-white">
            <Reveal>
              {countryData && (
                <div className="flex items-center gap-1.5 text-[9px] tracking-[0.3em] uppercase text-[#E8650A] mb-1.5">
                  <IconPin size={11} /> {countryData.cn} · {countryData.name}
                </div>
              )}
              <h1 className="font-display text-[40px] font-black leading-[0.92] tracking-tight">{item.cn}</h1>
              <p className="font-display italic text-white/75 text-[16px] mt-0.5">{item.name}</p>
            </Reveal>
          </div>
        </section>

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
                  <span key={tag} className="px-2.5 py-0.5 bg-[#F3ECE0] text-stone-700 text-[9px] tracking-[0.15em] font-bold rounded-full">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </section>

        {isDish && meal && (
          <>
            <section className="px-5 pt-7">
              <Reveal>
                <Eyebrow num="01">这道菜</Eyebrow>
                <p className="font-display italic text-stone-800 text-[16px] leading-[1.6] mt-3">{meal.story}</p>
              </Reveal>
            </section>

            <section className="px-5 pt-6">
              <div className="bg-white rounded-2xl border border-stone-200/70 px-4 py-3.5">
                <MealStats meal={meal} />
              </div>
            </section>

            <section className="px-5 pt-7">
              <Reveal>
                <div className="flex items-baseline justify-between">
                  <Eyebrow num="02">食材</Eyebrow>
                  <p className="font-display text-stone-500 text-[11px] tracking-[0.15em]">2 人份</p>
                </div>
              </Reveal>
              <p className="mt-2 text-[10px] tracking-[0.1em] uppercase text-stone-400 flex items-center gap-1.5">
                <span className="inline-flex w-3.5 h-3.5 rounded-full border-[1.5px] border-[#E8650A] items-center justify-center text-[#E8650A] leading-none" style={{ fontSize: '8px' }}>+</span>
                已含在菜品内 · 点 + 可单独加购
              </p>
              <ul className="mt-3 divide-y divide-stone-300/80 border-y border-stone-300/80">
                {meal.recipe.ingredients.map((ingredient, index) => {
                  const match = matchShopItem(ingredient)
                  const isChecked = checked.has(index)
                  const isPurchasable = match && !match.isNotPurchasable
                  const inCart = match ? isInCart(match.id) : false
                  return (
                    <Reveal key={index} delay={index * 50}>
                      <li className="flex items-center gap-3 py-3 group">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.preventDefault()
                            if (!isPurchasable || !match) return
                            if (inCart) {
                              toggleItem(match)
                            } else {
                              toggle(index)
                              toggleItem(match)
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
                          } ${flyAnimId === match?.id ? 'animate-add-fly' : ''}`}
                          aria-label={inCart ? `移出购物车：${match?.cn}` : `加购：${match?.cn || ingredient.t}`}
                        >
                          {inCart ? <IconX size={12} /> : <IconPlus size={14} />}
                        </button>
                        <span className="font-display text-[12px] font-bold text-stone-400 w-14 shrink-0">{ingredient.n}</span>
                        <div className="flex-1 min-w-0">
                          {isPurchasable && match ? (
                            <button
                              type="button"
                              onClick={(event) => { event.preventDefault(); onNavigate(match) }}
                              className="text-stone-800 text-[14px] font-bold text-left hover:text-[#E8650A] transition-colors truncate block w-full"
                            >
                              {match.cn}
                              <span className="ml-2 text-[#E8650A] text-[10px] font-normal opacity-0 group-hover:opacity-100 transition-opacity">→ 详情</span>
                            </button>
                          ) : (
                            <span className={`text-[14px] truncate block ${match?.isNotPurchasable ? 'text-stone-400' : 'text-stone-600'}`}>
                              {ingredient.t}
                              {match?.isNotPurchasable && <span className="ml-2 text-[10px] text-stone-400">不可购买</span>}
                            </span>
                          )}
                          {isPurchasable && match && (
                            <p className="text-stone-500 text-[10px] mt-0.5">
                              ¥{match.price} / {match.unit}
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

            <section className="px-5 pt-7">
              <Reveal>
                <Eyebrow num="03">风味笔记</Eyebrow>
                <div className="mt-4 bg-[#EBE3D3] rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0">
                      <IconFire size={15} stroke="#E8650A" />
                    </div>
                    <div className="flex-1">
                      <p className="font-display italic text-[#1A1208] text-[14px] leading-[1.6]">{tasteReview(meal.taste)}</p>
                      <p className="text-stone-500 text-[10px] mt-2 tracking-[0.15em] uppercase">风味 · {meal.taste}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </section>
          </>
        )}

        {!isDish && (
          <>
            <section className="px-5 pt-7">
              <Reveal>
                <Eyebrow num="01">产地</Eyebrow>
                <p className="font-display italic text-stone-800 text-[16px] leading-[1.6] mt-3">{originText(item)}</p>
              </Reveal>
            </section>

            <section className="px-5 pt-7">
              <Reveal>
                <Eyebrow num="02">怎么用</Eyebrow>
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
                <Eyebrow num="03">为什么值得买</Eyebrow>
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

        <section className="px-5 pt-8">
          <Reveal>
            <div className="flex items-baseline justify-between">
              <Eyebrow num="04">你可能还喜欢</Eyebrow>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setRecSeed((seed) => seed + 1)}
                  className="flex items-center gap-1 text-[10px] tracking-[0.15em] uppercase text-stone-500 hover:text-[#E8650A] active:scale-95 transition-all"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 2v6h-6" /><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M3 22v-6h6" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                  </svg>
                  换一批
                </button>
                {onBackToShop && (
                  <button
                    onClick={onBackToShop}
                    className="flex items-center gap-1 text-[10px] tracking-[0.15em] uppercase text-stone-500 hover:text-[#E8650A] active:scale-95 transition-all"
                  >
                    更多 <IconArrowRight size={11} />
                  </button>
                )}
              </div>
            </div>
          </Reveal>
          <div className="mt-5 grid grid-cols-2 gap-4">
            {recs.map((rec, index) => {
              const recCountry = rec.country ? COUNTRIES[rec.country] : null
              const alreadyInCart = cartItemIds?.has(rec.id)
              return (
                <Reveal key={rec.id} delay={index * 60}>
                  <button
                    onClick={() => onNavigate(rec)}
                    className="group relative w-full text-left active:scale-95 transition-transform duration-200"
                  >
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-stone-100 shadow-sm ring-1 ring-stone-200/60">
                      {rec.category === 'dish' ? (
                        <FallbackImage
                          src={rec.img}
                          alt={rec.cn}
                          loading="lazy"
                          className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-110 group-hover:saturate-105"
                        />
                      ) : (
                        <ProductArtwork item={rec} className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-105" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                        <div className="w-full flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <IconShoppingCart size={11} stroke="#fff" />
                            <span className="text-white text-[10px] font-bold tracking-wider uppercase">查看</span>
                          </div>
                          <IconArrowRight size={12} stroke="#fff" />
                        </div>
                      </div>
                      {recCountry && (
                        <span className="absolute top-2 left-2 w-6 h-6 bg-white/95 rounded-full flex items-center justify-center text-[10px] shadow-sm backdrop-blur">
                          {SHOP_COUNTRIES.find((country) => country.id === rec.country)?.flag}
                        </span>
                      )}
                      {alreadyInCart && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 bg-[#1A1208] text-white text-[9px] font-bold tracking-wider rounded-full shadow-sm backdrop-blur">
                          已加购
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex items-baseline justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-[12px] font-bold text-stone-900 leading-tight line-clamp-1 group-hover:text-[#E8650A] transition-colors">{rec.cn}</p>
                        <p className="text-stone-400 text-[10px] mt-0.5 line-clamp-1">{rec.name}</p>
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

      <div className="absolute bottom-0 left-0 right-0 z-30 px-4 pb-5 pt-3 bg-gradient-to-t from-[#F3ECE0] via-[#F3ECE0]/95 to-transparent">
        <button
          onClick={bottomCta}
          className="w-full py-4 rounded-2xl text-[12px] tracking-[0.2em] font-bold flex items-center justify-center gap-2.5 transition-all duration-300 active:scale-[0.98] bg-[#1A1208] text-[#E8650A] hover:bg-[#2A1F0F] shadow-lg shadow-stone-900/20"
        >
          {isInCart(item.id) ? (
            <><IconX size={14} /> 从购物车移除</>
          ) : (
            <><IconPlus size={15} /> {bottomCtaLabel}</>
          )}
        </button>
      </div>
    </div>
  )
}
