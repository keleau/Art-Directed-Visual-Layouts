import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  IconSearch, IconBack, IconX, IconClockHistory, IconArrowRight,
  Reveal, FallbackImage,
} from '../components'
import { COUNTRIES } from '../data'

const SEARCH_HISTORY_KEY = 'fa_search_history'
const MAX_HISTORY = 10
const MEAL_KEYS = ['breakfast', 'lunch', 'dinner', 'dessert', 'snack', 'streetFood']
const MEAL_LABELS = {
  breakfast: '早餐', lunch: '午餐', dinner: '晚餐', dessert: '甜点', snack: '小食', streetFood: '街食',
}

function getAllDishes() {
  const results = []
  Object.entries(COUNTRIES).forEach(([country, data]) => {
    MEAL_KEYS.forEach((mealKey) => {
      results.push({ meal: data[mealKey], country, countryData: data, mealKey })
    })
  })
  return results
}

function loadHistory() {
  try {
    const raw = localStorage.getItem(SEARCH_HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveHistory(history) {
  try { localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history)) } catch { /* noop */ }
}

const TRENDING = [
  { en: 'Tonkotsu Ramen', cn: '豚骨拉面', country: '日本' },
  { en: 'Cacio e Pepe', cn: '奶酪黑椒意面', country: '意大利' },
  { en: 'Pad Thai', cn: '泰式炒河粉', country: '泰国' },
  { en: 'Birria Tacos', cn: '比利亚肉汤塔可', country: '墨西哥' },
  { en: 'Croissant & Café au Lait', cn: '牛角包配拿铁', country: '法国' },
  { en: 'Peking Duck', cn: '北京烤鸭', country: '中国' },
]

export function SearchScreen({ onBack, onRecipe }) {
  const [query, setQuery] = useState('')
  const [history, setHistory] = useState(() => loadHistory())
  const inputRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 350)
    return () => clearTimeout(timer)
  }, [])

  const allDishes = useMemo(() => getAllDishes(), [])

  const results = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) return []
    return allDishes.filter((dish) => (
      dish.meal.en.toLowerCase().includes(keyword)
      || dish.meal.cn.includes(keyword)
      || dish.countryData.name.toLowerCase().includes(keyword)
      || dish.countryData.cn.includes(keyword)
    ))
  }, [query, allDishes])

  const addToHistory = useCallback((term) => {
    const value = term.trim()
    if (!value) return
    setHistory((prev) => {
      const next = [value, ...prev.filter((item) => item !== value)].slice(0, MAX_HISTORY)
      saveHistory(next)
      return next
    })
  }, [])

  const removeFromHistory = useCallback((term) => {
    setHistory((prev) => {
      const next = prev.filter((item) => item !== term)
      saveHistory(next)
      return next
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    saveHistory([])
  }, [])

  const handleBack = () => {
    if (query.trim()) {
      setQuery('')
      inputRef.current?.focus()
    } else {
      onBack()
    }
  }

  const showSuggestions = !query.trim()

  return (
    <div className="h-full bg-[#F3ECE0] flex flex-col">
      <div className="sticky top-0 z-30 bg-[#F3ECE0]/95 backdrop-blur-md border-b border-stone-300/40">
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <button
            onClick={handleBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-200/60 active:scale-95 transition-colors"
            aria-label={query.trim() ? '清除搜索' : '返回'}
          >
            <IconBack size={22} stroke="#2A1F0F" />
          </button>
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <IconSearch size={18} stroke="#8B7355" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && addToHistory(query)}
              placeholder="搜索菜品、国家…"
              className="w-full h-11 pl-11 pr-11 bg-white/80 rounded-full text-[15px] text-stone-900 placeholder:text-stone-400 border border-stone-300/60 focus:border-[#E8650A]/50 focus:outline-none focus:ring-2 focus:ring-[#E8650A]/20 transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-stone-200 hover:bg-stone-300 active:scale-90 transition-colors"
                aria-label="清除"
              >
                <IconX size={14} stroke="#6B5D47" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {showSuggestions && (
          <div className="px-6 pt-5">
            <Reveal>
              {history.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <IconClockHistory size={14} stroke="#8B7355" />
                      <span className="text-[11px] tracking-[0.25em] uppercase text-stone-500 font-semibold">搜索历史</span>
                    </div>
                    <button
                      type="button"
                      onClick={clearHistory}
                      className="text-[10px] tracking-widest uppercase text-stone-400 hover:text-stone-600 transition-colors"
                    >
                      清除全部
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {history.map((term) => (
                      <div
                        key={term}
                        role="button"
                        tabIndex={0}
                        onClick={() => { setQuery(term); addToHistory(term) }}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') setQuery(term)
                        }}
                        className="group flex items-center gap-1.5 px-4 py-2 bg-white rounded-full border border-stone-200 text-[13px] text-stone-700 hover:border-[#E8650A]/40 hover:text-[#E8650A] active:scale-95 transition-all cursor-pointer"
                      >
                        <span>{term}</span>
                        <button
                          type="button"
                          onClick={(event) => { event.stopPropagation(); removeFromHistory(term) }}
                          className="w-4 h-4 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-60 hover:!opacity-100 hover:bg-stone-200 transition-all"
                          aria-label={`删除搜索记录：${term}`}
                        >
                          <IconX size={10} stroke="#6B5D47" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-[11px] tracking-[0.25em] uppercase text-stone-500 font-semibold mb-3">热门搜索</p>
                <div className="grid grid-cols-2 gap-3">
                  {TRENDING.map((item) => (
                    <button
                      key={item.en}
                      type="button"
                      onClick={() => setQuery(item.cn)}
                      className="p-3 bg-white rounded-2xl border border-stone-200 text-left hover:border-[#E8650A]/40 hover:shadow-md active:scale-[0.98] transition-all"
                    >
                      <p className="font-display text-[14px] font-bold text-stone-900 leading-tight">{item.cn}</p>
                      <p className="text-[12px] text-stone-500 mt-0.5">{item.country} · {item.en}</p>
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        )}

        {!showSuggestions && (
          <div className="px-4 pt-4 pb-24">
            <div className="flex items-center justify-between px-2 mb-4">
              <span className="text-[11px] tracking-[0.25em] uppercase text-stone-500 font-semibold">
                找到 {results.length} 道菜
              </span>
            </div>
            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-6">
                <div className="w-16 h-16 rounded-full bg-stone-200/60 flex items-center justify-center mb-4">
                  <IconSearch size={28} stroke="#8B7355" />
                </div>
                <p className="font-display text-[18px] font-bold text-stone-700 mb-1">没有找到结果</p>
                <p className="text-stone-500 text-[14px] text-center">换个关键词试试看</p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((result, index) => (
                  <Reveal key={`${result.country}-${result.mealKey}`} delay={index * 50}>
                    <button
                      type="button"
                      onClick={() => { addToHistory(query.trim() || result.meal.cn); onRecipe(result.meal, result.countryData) }}
                      className="w-full flex gap-4 p-3 bg-white rounded-2xl border border-stone-200 text-left hover:border-[#E8650A]/30 hover:shadow-lg active:scale-[0.99] transition-all group"
                    >
                      <div className="flex-shrink-0 w-[88px] h-[88px] rounded-xl overflow-hidden bg-stone-100">
                        <FallbackImage
                          src={result.meal.img}
                          alt={result.meal.cn}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex-1 min-w-0 py-1">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[9px] tracking-[0.25em] uppercase px-2 py-0.5 bg-[#E8650A]/10 text-[#E8650A] rounded-full font-semibold">
                            {result.countryData.flag}
                          </span>
                          <span className="text-[10px] tracking-widest uppercase text-stone-400">
                            {result.countryData.cn} · {MEAL_LABELS[result.mealKey]}
                          </span>
                        </div>
                        <p className="font-display text-[16px] font-bold text-stone-900 leading-tight truncate">{result.meal.cn}</p>
                        <p className="text-[13px] text-stone-500 mt-0.5 truncate">{result.meal.en}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[11px] text-stone-400 flex items-center gap-1">
                            <IconClockHistory size={11} stroke="#8B7355" />
                            {result.meal.time}
                          </span>
                          <span className="text-[13px] font-bold text-[#E8650A]">¥{result.meal.price}</span>
                        </div>
                      </div>
                      <div className="flex items-center self-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <IconArrowRight size={18} stroke="#8B7355" />
                      </div>
                    </button>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
