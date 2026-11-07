import { useEffect, useMemo, useState } from 'react'
import { IconSearch, IconX, IconArrowRight } from '../components/icons'
import { ProductCard } from '../components'
import { SHOP_ITEMS, SHOP_COUNTRIES } from '../data'

export function ShopScreen({
  onBack,
  initialCountry = 'all',
  onItemDetail,
  onAddToCart,
  justAddedId,
}) {
  const [selectedCountry, setSelectedCountry] = useState(initialCountry)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setSelectedCountry(initialCountry)
  }, [initialCountry])

  const filteredItems = useMemo(() => {
    let items = SHOP_ITEMS
    if (selectedCountry !== 'all') {
      items = items.filter((item) => item.country === selectedCountry)
    }
    const keyword = searchQuery.trim().toLowerCase()
    if (keyword) {
      items = items.filter((item) => (
        item.name.toLowerCase().includes(keyword)
        || item.cn.includes(keyword)
        || item.description.toLowerCase().includes(keyword)
      ))
    }
    return items
  }, [selectedCountry, searchQuery])

  const currentCountryData = SHOP_COUNTRIES.find((country) => country.id === selectedCountry)

  return (
    <div className="h-full overflow-y-auto bg-[#F3ECE0] relative pb-24">
      <div className="sticky top-0 z-30 bg-[#F3ECE0]/85 backdrop-blur-xl">
        <div className="px-5 pt-11 pb-3 border-b border-stone-200/40">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-stone-700 bg-white/70 backdrop-blur px-3.5 py-1.5 rounded-full text-[11px] tracking-[0.2em] hover:bg-white active:scale-95 transition-all duration-200 border border-stone-200/50"
            >
              <IconArrowRight size={12} style={{ transform: 'rotate(180deg)' }} />
              返回
            </button>
            <div className="text-center">
              <p className="text-[9px] tracking-[0.3em] uppercase text-stone-400">第四章 · 市集</p>
              <h1 className="font-display text-[22px] font-black text-stone-900 tracking-tight leading-none">市集</h1>
            </div>
            <div className="w-14" />
          </div>

          <div className="relative">
            <IconSearch size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="搜索食材、调味料…"
              className="w-full pl-10 pr-10 py-2.5 bg-white/80 border border-stone-200/60 rounded-full text-[13px] focus:outline-none focus:border-[#E8650A]/40 focus:bg-white transition-all duration-200 placeholder:text-stone-400 font-body"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-stone-200 hover:bg-stone-300 active:scale-90 transition-colors"
                aria-label="清除搜索"
              >
                <IconX size={10} className="text-stone-500" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[9px] tracking-[0.25em] uppercase text-stone-400">选择地区 · Regions</span>
          {currentCountryData && currentCountryData.id !== 'all' && (
            <button
              onClick={() => setSelectedCountry('all')}
              className="text-[10px] text-[#E8650A] hover:underline transition-colors font-medium"
            >
              清除
            </button>
          )}
        </div>
        <div className="relative -mx-1 px-1 overflow-x-auto scrollbar-hide pb-1">
          <div className="flex gap-2 min-w-max">
            {SHOP_COUNTRIES.map((country, index) => {
              const isActive = selectedCountry === country.id
              return (
                <button
                  key={country.id}
                  onClick={() => setSelectedCountry(country.id)}
                  className={`relative flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-[#1A1208] text-[#E8650A] shadow-md shadow-stone-900/10'
                      : 'bg-white/60 text-stone-500 hover:bg-white hover:text-stone-700 border border-stone-200/40'
                  }`}
                  style={{ animationDelay: `${index * 40}ms`, animation: 'fadeUp 0.5s cubic-bezier(.2,.7,.2,1) both' }}
                >
                  {country.flag && <span className="text-sm leading-none">{country.flag}</span>}
                  <span className={`text-[12px] font-medium whitespace-nowrap ${isActive ? 'tracking-wide' : ''}`}>{country.cn}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="px-5 pt-4 pb-4">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2.5">
            <h2 className="font-display text-[26px] font-black text-stone-900 leading-none tracking-tight">
              {selectedCountry === 'all' ? '全部商品' : `${currentCountryData?.cn}精选`}
            </h2>
            <span className="text-[12px] text-stone-400 font-medium">{filteredItems.length} 件</span>
          </div>
        </div>
        <div className="mt-3 w-10 h-[2px] bg-gradient-to-r from-[#E8650A] to-[#E8650A]/20 rounded-full" />
      </div>

      <div className="px-5 pb-48">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredItems.map((item, index) => (
              <ProductCard
                key={item.id}
                item={item}
                index={index}
                justAdded={justAddedId === item.id}
                onOpen={onItemDetail}
                onAdd={onAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-stone-400">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
              <IconSearch size={32} className="text-stone-300" />
            </div>
            <p className="font-display text-2xl italic text-stone-500">暂无商品</p>
            <p className="text-sm mt-3 text-stone-400">试试其他地区或关键词</p>
          </div>
        )}
      </div>
    </div>
  )
}
