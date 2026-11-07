import { useState, useMemo, useEffect } from 'react'
import { IconSearch, IconX, IconPlus, IconArrowRight } from '../components/icons'
import type { ShopItem, CartItem } from '../types'
import { SHOP_ITEMS, SHOP_COUNTRIES } from '../data'

export function ShopScreen({
  onBack,
  initialCountry = 'all',
  onItemDetail,
  onAddToCart,
  justAddedId,
}: {
  onBack?: () => void
  initialCountry?: string
  onItemDetail: (item: ShopItem) => void
  cart: CartItem[]
  cartCount: number
  cartTotal: number
  onAddToCart: (item: ShopItem) => void
  onUpdateCartQuantity: (itemId: string, delta: number) => void
  justAddedId: string | null
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
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.cn.includes(q) ||
          item.description.toLowerCase().includes(q)
      )
    }
    return items
  }, [selectedCountry, searchQuery])

  const currentCountryData = SHOP_COUNTRIES.find((c) => c.id === selectedCountry)

  return (
    <div className="h-full overflow-y-auto bg-[#F3ECE0] relative pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#F3ECE0]/85 backdrop-blur-xl">
        <div className="px-5 pt-11 pb-3 border-b border-stone-200/40">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-stone-700 bg-white/70 backdrop-blur px-3.5 py-1.5 rounded-full text-[11px] tracking-[0.2em] uppercase hover:bg-white active:scale-95 transition-all duration-200 border border-stone-200/50"
            >
              <IconArrowRight size={12} style={{ transform: 'rotate(180deg)' }} />
              Back
            </button>
            <div className="text-center">
              <p className="text-[9px] tracking-[0.35em] uppercase text-stone-400">Chapter 04 · Market</p>
              <h1 className="font-display text-[22px] font-black text-stone-900 tracking-tight leading-none">
                市集
              </h1>
            </div>
            <div className="w-14" />
          </div>

          {/* Search */}
          <div className="relative">
            <IconSearch size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索食材、调味料..."
              className="w-full pl-10 pr-10 py-2.5 bg-white/80 border border-stone-200/60 rounded-full text-[13px] focus:outline-none focus:border-[#E8650A]/40 focus:bg-white transition-all duration-200 placeholder:text-stone-400 font-body"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-stone-200 hover:bg-stone-300 active:scale-90 transition-colors"
              >
                <IconX size={10} className="text-stone-500" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Country Filter */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[9px] tracking-[0.3em] uppercase text-stone-400">选择地区 · Regions</span>
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
            {SHOP_COUNTRIES.map((country, idx) => {
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
                  style={{
                    animationDelay: `${idx * 40}ms`,
                    animation: 'fadeUp 0.5s cubic-bezier(.2,.7,.2,1) both',
                  }}
                >
                  {country.flag && (
                    <span className="text-sm leading-none">{country.flag}</span>
                  )}
                  <span className={`text-[12px] font-medium whitespace-nowrap ${isActive ? 'tracking-wide' : ''}`}>
                    {country.cn}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Section Title */}
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

      {/* Products Grid */}
      <div className="px-5 pb-48">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredItems.map((item, idx) => {
              const justAdded = justAddedId === item.id
              return (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_-4px_rgba(26,18,8,0.08)] hover:shadow-[0_8px_24px_-8px_rgba(26,18,8,0.15)] transition-all duration-500 group border border-stone-100/80 hover:border-stone-200/80 cursor-pointer active:scale-[0.985]"
                style={{
                  animation: 'fadeUp 0.6s cubic-bezier(.2,.7,.2,1) both',
                  animationDelay: `${idx * 35}ms`,
                }}
                onClick={() => onItemDetail(item)}
              >
                <div className="relative aspect-[5/4] overflow-hidden bg-stone-50">
                  <img
                    src={item.img}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      const el = e.currentTarget
                      if (!el.dataset.fallback) {
                        el.dataset.fallback = '1'
                        el.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20400%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23e7e5e4%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23d6d3d1%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22400%22%20height%3D%22400%22%20fill%3D%22url(%23g)%22%2F%3E%3Ctext%20x%3D%22200%22%20y%3D%22210%22%20font-family%3D%22sans-serif%22%20font-size%3D%2248%22%20fill%3D%22%23a8a29e%22%20text-anchor%3D%22middle%22%3E🍽%3C%2Ftext%3E%3C%2Fsvg%3E'
                      }
                    }}
                  />
                  {/* Country flag */}
                  {item.country && (
                    <span className="absolute top-2.5 left-2.5 w-6 h-6 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center text-[11px] shadow-sm">
                      {SHOP_COUNTRIES.find((c) => c.id === item.country)?.flag}
                    </span>
                  )}
                  {/* Tag */}
                  {item.tags && item.tags.length > 0 && (
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-[#E8650A] text-white text-[8px] tracking-[0.15em] uppercase font-bold rounded-full shadow-sm">
                      {item.tags[0]}
                    </span>
                  )}
                </div>
                <div className="p-3.5">
                  <h4 className="font-display text-[13px] font-bold text-stone-900 leading-tight line-clamp-1 group-hover:text-[#C9550A] transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-stone-400 text-[10px] mt-1 line-clamp-1">{item.cn}</p>
                  {item.sourceMeal && (
                    <p className="text-stone-400/60 text-[9px] mt-1 italic line-clamp-1">
                      from {item.sourceMeal}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-stone-100">
                    <div className="flex items-baseline gap-0.5">
                      <span className="font-display text-[16px] font-black text-[#E8650A]">¥{item.price}</span>
                      <span className="text-stone-400 text-[9px]">/{item.unit}</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); onAddToCart(item) }}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 ${
                        justAdded
                          ? 'bg-[#E8650A] text-white scale-110 shadow-md shadow-[#E8650A]/25'
                          : 'bg-[#1A1208] text-[#E8650A] hover:bg-[#2A2218] hover:scale-105'
                      }`}
                      aria-label={`Add ${item.name} to cart`}
                    >
                      <IconPlus size={12} />
                    </button>
                  </div>
                </div>
              </div>
              )
            })}
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
