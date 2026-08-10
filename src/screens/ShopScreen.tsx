import { useState, useMemo } from 'react'
import { IconSearch, IconX, IconMinus, IconPlus, IconShoppingCart } from '../components/icons'
import type { ShopItem, ShopCategory, CartItem, Country } from '../types'
import { SHOP_ITEMS, SHOP_COUNTRIES } from '../data'

const CATEGORIES: { id: ShopCategory; label: string; cn: string }[] = [
  { id: 'all', label: 'All', cn: '全部' },
  { id: 'mealKit', label: 'Meal Kits', cn: '料理包' },
  { id: 'vegetable', label: 'Produce', cn: '蔬菜' },
  { id: 'ingredient', label: 'Ingredients', cn: '食材' },
  { id: 'sauce', label: 'Sauces', cn: '酱料' },
]

export function ShopScreen({ onBack }: { onBack?: () => void }) {
  const [selectedCountry, setSelectedCountry] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory>('all')
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)

  const filteredItems = useMemo(() => {
    return SHOP_ITEMS.filter((item) => {
      if (selectedCountry !== 'all' && item.country !== selectedCountry) {
        if (item.category === 'mealKit') return false
      }
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false
      if (selectedCountry === 'all' || item.category !== 'mealKit') return true
      return item.country === selectedCountry
    })
  }, [selectedCountry, selectedCategory])

  const cartTotal = cart.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0)
  const cartCount = cart.reduce((sum, ci) => sum + ci.quantity, 0)

  const addToCart = (item: ShopItem) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id)
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        )
      }
      return [...prev, { item, quantity: 1 }]
    })
    setCartOpen(true)
    setTimeout(() => setCartOpen(false), 2000)
  }

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((ci) =>
          ci.item.id === itemId ? { ...ci, quantity: Math.max(0, ci.quantity + delta) } : ci
        )
        .filter((ci) => ci.quantity > 0)
    })
  }

  return (
    <div className="h-full overflow-y-auto bg-[#F3ECE0] relative">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#F3ECE0]/95 backdrop-blur-sm border-b border-stone-200/60">
        <div className="px-6 pt-11 pb-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="text-stone-600 text-sm hover:text-[#E8650A] transition-colors"
            >
              ← Back
            </button>
            <h1 className="font-display text-[28px] font-black text-stone-900 tracking-tight">
              Shop
            </h1>
            <div className="w-12" />
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <IconSearch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search ingredients, sauces..."
              className="w-full pl-11 pr-4 py-3 bg-white/80 border border-stone-200 rounded-full text-sm focus:outline-none focus:border-[#E8650A]/50 placeholder:text-stone-400"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-6 px-6 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-[11px] tracking-widest uppercase font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#1A1208] text-[#E8650A]'
                    : 'bg-white/60 text-stone-600 hover:bg-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Country Navigation */}
      <div className="px-6 py-4 border-b border-stone-200/60">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          {SHOP_COUNTRIES.map((country) => (
            <button
              key={country.id}
              onClick={() => setSelectedCountry(country.id)}
              className={`flex-shrink-0 flex flex-col items-center gap-1 transition-all ${
                selectedCountry === country.id ? 'scale-105' : 'opacity-70 hover:opacity-100'
              }`}
            >
              {country.img ? (
                <div
                  className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all ${
                    selectedCountry === country.id
                      ? 'border-[#E8650A] shadow-lg shadow-[#E8650A]/20'
                      : 'border-transparent'
                  }`}
                >
                  <img src={country.img} alt={country.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all ${
                    selectedCountry === country.id
                      ? 'bg-[#1A1208] text-[#E8650A] border-2 border-[#E8650A]'
                      : 'bg-white text-stone-500 border-2 border-transparent'
                  }`}
                >
                  All
                </div>
              )}
              <span
                className={`text-[10px] tracking-widest uppercase font-medium ${
                  selectedCountry === country.id ? 'text-[#E8650A]' : 'text-stone-500'
                }`}
              >
                {country.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-4 py-4 pb-32">
        <div className="grid grid-cols-2 gap-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="relative aspect-square overflow-hidden bg-stone-100">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {item.country && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 text-[9px] tracking-widest uppercase text-stone-700 rounded-full">
                    {SHOP_COUNTRIES.find((c) => c.id === item.country)?.flag}
                  </span>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-display text-[13px] font-bold text-stone-900 leading-tight truncate">
                  {item.name}
                </h3>
                <p className="text-stone-500 text-[11px] mt-0.5 truncate">{item.cn}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-display text-[15px] font-bold text-[#E8650A]">
                    ¥{item.price}
                  </span>
                  <span className="text-stone-400 text-[9px]">{item.unit}</span>
                </div>
                <button
                  onClick={() => addToCart(item)}
                  className="w-full mt-2 py-2 bg-[#1A1208] text-[#E8650A] text-[10px] tracking-widest uppercase font-medium rounded-full active:scale-95 transition-transform hover:bg-[#2A2218]"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20 text-stone-400">
            <p className="text-lg font-display italic">No items found</p>
            <p className="text-sm mt-2">Try a different category or country</p>
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <div className="fixed bottom-[72px] right-4 z-40">
          <button
            onClick={() => setCartOpen(!cartOpen)}
            className="relative w-14 h-14 bg-[#1A1208] rounded-full flex items-center justify-center shadow-lg shadow-black/30 active:scale-95 transition-transform"
          >
            <IconShoppingCart size={24} color="#E8650A" />
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-[#E8650A] text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-[#1A1208]">
              {cartCount}
            </span>
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && cartCount > 0 && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setCartOpen(false)}
          />
          <div className="fixed bottom-[56px] left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[60vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-stone-100">
              <h3 className="font-display text-lg font-bold text-stone-900">
                Your Cart ({cartCount})
              </h3>
              <button
                onClick={() => setCartOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 text-stone-500"
              >
                <IconX size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.map((ci) => (
                <div key={ci.item.id} className="flex gap-3 bg-stone-50 rounded-xl p-3">
                  <img
                    src={ci.item.img}
                    alt={ci.item.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display text-sm font-bold text-stone-900 truncate">
                      {ci.item.name}
                    </h4>
                    <p className="text-stone-500 text-xs mt-0.5 truncate">{ci.item.cn}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-display text-base font-bold text-[#E8650A]">
                        ¥{ci.item.price * ci.quantity}
                      </span>
                      <div className="flex items-center gap-2 bg-white rounded-full border border-stone-200">
                        <button
                          onClick={() => updateQuantity(ci.item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-[#E8650A]"
                        >
                          <IconMinus size={14} />
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{ci.quantity}</span>
                        <button
                          onClick={() => updateQuantity(ci.item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-[#E8650A]"
                        >
                          <IconPlus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-100 p-4 bg-white">
              <div className="flex items-center justify-between mb-3">
                <span className="text-stone-600">Total</span>
                <span className="font-display text-2xl font-black text-stone-900">
                  ¥{cartTotal}
                </span>
              </div>
              <button
                onClick={() => {
                  setCart([])
                  setCartOpen(false)
                }}
                className="w-full py-4 bg-[#E8650A] text-white rounded-full font-bold tracking-widest text-sm active:scale-[0.98] transition-transform hover:bg-[#D45A09]"
              >
                CHECKOUT · ¥{cartTotal}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
