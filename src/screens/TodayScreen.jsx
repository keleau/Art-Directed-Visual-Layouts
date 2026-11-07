import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  IconClock, IconFire, IconPan, IconStar, IconPlus, IconBookmark, IconArrowRight,
  Reveal, PeriodIntro, FallbackImage,
} from '../components'
import { COUNTRIES } from '../data'
import {
  MEAL_META, PERIOD_LABELS, PERIOD_MEAL_INDEX, getChinaHour, periodFromHour,
} from '../lib/periods'
import { ensureAudioReady, playPeriodSound, stopAllPeriodSounds } from '../lib/periodSound'

const PERIOD_ICONS = [IconClock, IconFire, IconPan, IconStar]

export function TodayScreen({
  country,
  setCountry,
  todayCountry,
  featuredMealKey,
  onRecipe,
  onBack,
  active,
}) {
  const [focusMode, setFocusMode] = useState(true)
  const [autoCountry, setAutoCountry] = useState(true)
  const [introPhase, setIntroPhase] = useState(0)

  const hour = getChinaHour()
  const currentMealIdx = hour < 11 ? 0 : hour < 18 ? 1 : hour < 19 ? 2 : 3
  const period = periodFromHour(hour)
  const periodLabel = PERIOD_LABELS[period]
  const effectiveCountry = autoCountry && todayCountry ? todayCountry : country
  const c = COUNTRIES[effectiveCountry]

  useEffect(() => {
    if (!active) return undefined
    setIntroPhase(1)
    ensureAudioReady()
    playPeriodSound(period)

    const fadeTimer = window.setTimeout(() => setIntroPhase(2), 2300)
    const closeTimer = window.setTimeout(() => setIntroPhase(0), 3150)
    return () => {
      window.clearTimeout(fadeTimer)
      window.clearTimeout(closeTimer)
      stopAllPeriodSounds()
    }
  }, [active, period, effectiveCountry])

  const totalKcal = useMemo(
    () => MEAL_META.reduce((sum, meal) => sum + c[meal.key].kcal, 0),
    [c],
  )

  const totalMacros = useMemo(() => {
    const parse = (value) => parseInt(value.replace('g', ''), 10) || 0
    return MEAL_META.reduce(
      (sum, meal) => ({
        protein: sum.protein + parse(c[meal.key].macros.protein),
        carbs: sum.carbs + parse(c[meal.key].macros.carbs),
        fats: sum.fats + parse(c[meal.key].macros.fats),
      }),
      { protein: 0, carbs: 0, fats: 0 },
    )
  }, [c])

  const currentMeal = MEAL_META[currentMealIdx]
  const currentMealData = c[currentMeal.key]
  const CurrentMealIcon = PERIOD_ICONS[currentMealIdx]

  const cycleCountry = useCallback(() => {
    if (autoCountry) return
    const keys = Object.keys(COUNTRIES)
    const index = keys.indexOf(country)
    setCountry(keys[(index + 1) % keys.length])
  }, [autoCountry, country, setCountry])

  return (
    <div className="h-full overflow-y-auto pb-24 bg-[#F3ECE0]">
      {focusMode ? (
        <section className="relative">
          <div
            className="relative h-[540px] rounded-b-3xl overflow-hidden cursor-pointer group transition-transform duration-300 active:scale-[0.99]"
            onClick={() => onRecipe(currentMealData)}
          >
            <FallbackImage
              src={currentMealData.img}
              alt={currentMealData.cn}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03] hero-ken-burns"
            />
            <div className="absolute inset-x-0 bottom-0 h-60 bg-gradient-to-t from-black/40 to-transparent hero-gradient-breathe" />

            <div className="absolute top-9 left-5 z-20">
              <button
                onClick={(event) => { event.stopPropagation(); onBack?.() }}
                className="flex items-center gap-1.5 text-white/90 bg-black/25 backdrop-blur px-3 py-1.5 rounded-full text-[11px] tracking-[0.2em] hover:bg-black/40 active:scale-95 transition-colors"
              >
                <IconArrowRight size={12} style={{ transform: 'rotate(180deg)' }} />
                返回
              </button>
            </div>

            <div className="absolute top-9 right-5 z-20 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={(event) => { event.stopPropagation(); setAutoCountry((value) => !value) }}
                  className={`px-2 py-0.5 rounded-full flex items-center justify-center text-[9px] tracking-wider transition-all ${
                    autoCountry
                      ? 'bg-white/20 text-white/80 border border-white/20'
                      : 'bg-white/10 text-white/50 border border-white/10'
                  }`}
                  title={autoCountry ? '自动匹配今日目的地' : '手动选择目的地'}
                >
                  {autoCountry ? '自动' : '手动'}
                </button>
                <button
                  onClick={(event) => { event.stopPropagation(); if (!autoCountry) cycleCountry() }}
                  className={`flex items-center gap-1 transition-all ${autoCountry ? 'text-white/50' : 'text-white/80 hover:text-white'}`}
                  title={autoCountry ? '自动模式已锁定' : '点击切换国家'}
                  disabled={autoCountry}
                >
                  <span className="font-display text-[12px]">{c.cn}</span>
                </button>
              </div>

              <button
                onClick={(event) => { event.stopPropagation(); setFocusMode(false) }}
                className="flex items-center gap-1.5 text-white bg-white/20 backdrop-blur border border-white/30 px-3 py-1.5 rounded-full text-[11px] tracking-[0.15em] hover:bg-white/30 active:scale-95 transition-all"
              >
                <IconPlus size={12} />
                <span>全天</span>
              </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center hero-eyebrow-fade">
                  <CurrentMealIcon size={14} stroke="#fff" />
                </div>
                <p className="text-[9px] tracking-[0.35em] uppercase text-white/75 hero-eyebrow-fade hero-delay-150">
                  {MEAL_META[PERIOD_MEAL_INDEX[period]].time} · {MEAL_META[PERIOD_MEAL_INDEX[period]].cn}
                </p>
                {currentMeal.key === featuredMealKey && (
                  <span className="ml-1 bg-[#E8650A] text-white text-[8px] tracking-[0.2em] px-2 py-0.5 rounded-full font-semibold hero-badge-fade hero-delay-300">
                    今日推荐
                  </span>
                )}
              </div>
              <h1 className="font-display text-[42px] font-black leading-[0.95] tracking-tight hero-text-fade hero-delay-300">{currentMealData.cn}</h1>
              <p className="font-display italic text-white/85 text-[15px] mt-0.5 hero-subtitle-fade hero-delay-450">{currentMealData.en}</p>
              <div className="mt-3 flex items-center gap-1.5">
                <span className="bg-white/20 backdrop-blur-sm border border-white/25 text-white text-[9px] tracking-widest px-2.5 py-1 rounded-full hero-badge-fade hero-delay-600">{currentMealData.kcal} 千卡</span>
                <span className="bg-white/20 backdrop-blur-sm border border-white/25 text-white text-[9px] tracking-widest px-2.5 py-1 rounded-full hero-badge-fade hero-delay-750">{currentMealData.taste}</span>
              </div>
            </div>
          </div>

          <div
            className="absolute bottom-0 left-0 right-0 h-14 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, transparent, #F3ECE0)' }}
          />
        </section>
      ) : (
        <section className="px-5 pt-9 pb-2">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onBack?.()}
              className="flex items-center gap-1.5 text-stone-700 bg-white border border-stone-300 px-3 py-1.5 rounded-full text-[11px] tracking-[0.2em] hover:bg-stone-50 active:scale-95 transition-colors"
            >
              <IconArrowRight size={12} style={{ transform: 'rotate(180deg)' }} />
              返回
            </button>
            <button
              onClick={() => setFocusMode(true)}
              className="flex items-center gap-1.5 text-stone-700 bg-white border border-stone-300 px-3 py-1.5 rounded-full text-[11px] tracking-[0.15em] hover:bg-stone-50 active:scale-95 transition-all"
            >
              <IconBookmark size={12} />
              <span>单餐</span>
            </button>
          </div>
          <div className="flex items-center justify-between mb-4 mt-4">
            <div>
              <h1 className="font-display text-[32px] font-black leading-tight text-stone-900">{c.cn} · 今日</h1>
              <p className="font-display italic text-stone-600 text-[14px] mt-0.5">{periodLabel.cn}的味觉旅程</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setAutoCountry((value) => !value)}
              className={`px-2.5 py-1 rounded-full text-[10px] tracking-wider transition-all ${
                autoCountry
                  ? 'bg-[#E8650A]/10 text-[#E8650A] border border-[#E8650A]/30'
                  : 'bg-stone-100 text-stone-500 border border-stone-200'
              }`}
            >
              {autoCountry ? '自动目的地' : '手动目的地'}
            </button>
            {!autoCountry && (
              <button
                onClick={cycleCountry}
                className="px-2.5 py-1 rounded-full text-[10px] tracking-wider bg-stone-800 text-white hover:bg-stone-700 active:scale-95 transition-all"
              >
                切换国家
              </button>
            )}
          </div>
        </section>
      )}

      <div className="px-5">
        {!focusMode && (
          <TimelineMeals
            meals={MEAL_META}
            c={c}
            icons={PERIOD_ICONS}
            onRecipe={onRecipe}
            featuredMealKey={featuredMealKey}
          />
        )}
      </div>

      <section className="bg-[#F3ECE0] px-6 py-10 mt-2 border-t border-stone-300/60">
        <Reveal>
          <div className="flex items-center gap-2 mb-6">
            <span className="font-hand text-[20px] text-stone-600">四餐合计 —</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="font-display text-[64px] font-black text-[#E8650A]">{totalKcal}</p>
              <p className="text-stone-500 text-[11px] tracking-widest uppercase mt-1">千卡 · 总热量</p>
            </div>
            <div className="flex gap-4 text-right">
              {[
                { value: `${totalMacros.protein}g`, label: '蛋白质' },
                { value: `${totalMacros.carbs}g`, label: '碳水' },
                { value: `${totalMacros.fats}g`, label: '脂肪' },
              ].map((macro) => (
                <div key={macro.label} className="border-l-2 border-stone-300 pl-3">
                  <p className="font-display text-[18px] font-bold text-stone-900">{macro.value}</p>
                  <p className="text-stone-500 text-[9px] tracking-widest uppercase">{macro.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <button
            onClick={() => onRecipe(currentMealData)}
            className="mt-8 w-full bg-[#1A1208] text-white py-4 rounded-2xl text-[12px] tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-[#2A1F0F] active:scale-[0.98] transition-all"
          >
            <IconPan size={16} /> 烹饪今日菜单
          </button>
        </Reveal>
      </section>

      <PeriodIntro
        show={introPhase > 0}
        fading={introPhase === 2}
        period={period}
        country={c}
        periodLabel={periodLabel}
        mealTime={MEAL_META[PERIOD_MEAL_INDEX[period]].time}
        mealLabel={MEAL_META[PERIOD_MEAL_INDEX[period]].cn}
      />
    </div>
  )
}

export function TimelineMeals({ meals, c, icons, onRecipe, featuredMealKey }) {
  return (
    <section className="bg-[#F3ECE0] py-6 px-6">
      <Reveal>
        <p className="font-display italic text-[18px] text-stone-600 mb-6">今日行程<span className="text-stone-400"> · Today's Journey</span></p>
      </Reveal>
      <div className="relative">
        <svg className="absolute left-[22px] top-2 bottom-2 w-[2px]" preserveAspectRatio="none">
          <line x1="1" y1="0" x2="1" y2="100%" stroke="#8B7355" strokeWidth="1" strokeDasharray="3 5" />
        </svg>
        <div className="space-y-8">
          {meals.map((meal, index) => {
            const data = c[meal.key]
            const Icon = icons[index]
            return (
              <Reveal key={meal.key} delay={index * 80}>
                <div
                  className="relative flex gap-5 cursor-pointer active:scale-[0.99] transition-transform duration-150"
                  onClick={() => onRecipe(data)}
                >
                  <div
                    className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2 flex-shrink-0"
                    style={{ backgroundColor: meal.bg, borderColor: meal.accent, color: meal.accent }}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] tracking-[0.3em] text-stone-500">{meal.time} · {meal.cn}</p>
                      {meal.key === featuredMealKey && (
                        <span className="bg-[#E8650A]/15 text-[#E8650A] text-[8px] tracking-[0.2em] px-2 py-0.5 rounded-full font-semibold border border-[#E8650A]/30">今日推荐</span>
                      )}
                    </div>
                    <h3 className="font-display text-[26px] font-bold text-stone-900 leading-tight">{data.cn}</h3>
                    <p className="text-stone-500 text-sm">{data.en}</p>
                    <div className="mt-3 flex gap-2 flex-wrap">
                      <span className="text-[10px] tracking-widest px-2.5 py-1 rounded-full" style={{ backgroundColor: `${meal.accent}22`, color: meal.accent }}>{data.kcal} 千卡</span>
                      <span className="text-[10px] tracking-widest px-2.5 py-1 rounded-full bg-stone-200 text-stone-700">{data.time}</span>
                      <span className="text-[10px] tracking-widest px-2.5 py-1 rounded-full bg-stone-200 text-stone-700">{data.taste}</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
