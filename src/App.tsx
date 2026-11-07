import { useState, useRef, useMemo, useEffect } from 'react'
import { BottomNav, IconShoppingCart, IconX, IconMinus, IconPlus } from './components'
import type { Screen, Country, Meal, MealKey, CountryData, ShopItem, CartItem } from './types'
import {
  COUNTRIES, getDailyHeroData,
} from './data'
import { SplashScreen } from './screens/SplashScreen'
import { ExploreScreen } from './screens/ExploreScreen'
import { TodayScreen } from './screens/TodayScreen'
import { CookScreen } from './screens/CookScreen'
import { RecipeScreen } from './screens/RecipeScreen'
import { MeScreen } from './screens/MeScreen'
import { SearchScreen } from './screens/SearchScreen'
import { ShopScreen } from './screens/ShopScreen'
import { ShopItemDetailScreen } from './screens/ShopItemDetailScreen'

const CART_STORAGE_KEY = 'flavorAtlasCart'

export default function App() {
  const todayHero = useMemo(() => getDailyHeroData(), [])
  const todayCountry = todayHero.country

  const [screen, setScreen] = useState<Screen>('splash')
  const [country, setCountry] = useState<Country>(todayCountry)
  const prevScreenRef = useRef<Screen>('explore')
  const [shopCountry, setShopCountry] = useState<string>('all')
  const [shopItemCtx, setShopItemCtx] = useState<ShopItem | null>(null)
  const [shopItemHistory, setShopItemHistory] = useState<ShopItem[]>([])
  const [justAddedId, setJustAddedId] = useState<string | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [cartBounce, setCartBounce] = useState(false)
  const [cartBtnPos, setCartBtnPos] = useState({ x: -1, y: -1 })
  const cartBtnPosRef = useRef({ x: -1, y: -1 })
  const dragRef = useRef<{ started: boolean; wasDragging: boolean; offX: number; offY: number; appRect: DOMRect | null }>({ started: false, wasDragging: false, offX: 0, offY: 0, appRect: null })

  // ─── 购物车持久化 ───
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) setCart(parsed)
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch {}
  }, [cart])

  const [recipeCtx, setRecipeCtx] = useState<{ meal: Meal; country: CountryData }>(() => {
    const c = COUNTRIES[todayCountry]
    return { meal: c[todayHero.chefMealKey], country: c }
  })

  const cartTotal = cart.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0)
  const cartCount = cart.reduce((sum, ci) => sum + ci.quantity, 0)
  const cartItemIds = useMemo(() => new Set(cart.map((ci) => ci.item.id)), [cart])

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
    setJustAddedId(item.id)
    setTimeout(() => setJustAddedId(null), 1500)
    setCartBounce(true)
    setTimeout(() => setCartBounce(false), 400)
  }

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((ci) =>
          ci.item.id === itemId ? { ...ci, quantity: Math.max(0, ci.quantity + delta) } : ci
        )
        .filter((ci) => ci.quantity > 0)
    )
  }

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.item.id !== itemId))
  }

  const goTo = (s: Screen) => {
    if (s === 'recipe' || s === 'shop-item') {
      prevScreenRef.current = screen
    }
    if (s === 'today' && screen !== 'today') {
      setCountry(todayCountry)
    }
    setScreen(s)
  }

  const goBackFromRecipe = () => {
    setScreen(prevScreenRef.current || 'explore')
  }

  const openItemDetail = (item: ShopItem) => {
    setShopItemHistory([])
    setShopItemCtx(item)
    goTo('shop-item')
  }

  const navigateItemDetail = (item: ShopItem) => {
    setShopItemHistory((prev) => shopItemCtx ? [...prev, shopItemCtx] : prev)
    setShopItemCtx(item)
  }

  const goBackFromShopItem = () => {
    if (shopItemHistory.length > 0) {
      const prev = shopItemHistory[shopItemHistory.length - 1]
      setShopItemHistory((h) => h.slice(0, -1))
      setShopItemCtx(prev)
    } else {
      setScreen(prevScreenRef.current || 'shop')
    }
  }

  const openRecipe = (meal: Meal, countryData: CountryData) => {
    setRecipeCtx({ meal, country: countryData })
    goTo('recipe')
  }

  const openMealByKey = (mealKey: MealKey, c: CountryData) => {
    openRecipe(c[mealKey], c)
  }

  const beginTodayJourney = () => {
    setCountry(todayCountry)
    goTo('today')
  }

  const showScreen = (s: Screen) => screen === s
  const appVisible = screen !== 'splash'
  const currentCountryData = COUNTRIES[todayCountry]

  const toggleCart = () => setCartOpen((v) => !v)

  // ─── 浮动购物车拖拽 ───
  const BTN_SIZE = 48
  const BTN_MARGIN = 8
  const NAV_H = 70
  let rafId: number | null = null

  useEffect(() => {
    const appEl = document.querySelector('.app-container') as HTMLElement | null
    if (appEl && cartBtnPosRef.current.x < 0) {
      const rect = appEl.getBoundingClientRect()
      const x = rect.width - BTN_SIZE - BTN_MARGIN
      const y = rect.height - BTN_SIZE - NAV_H - BTN_MARGIN
      cartBtnPosRef.current = { x, y }
      setCartBtnPos({ x, y })
    }
  }, [])

  const handleCartBtnPointerDown = (e: React.PointerEvent) => {
    const appEl = (e.currentTarget as HTMLElement).closest('.app-container') as HTMLElement | null
    const appRect = appEl?.getBoundingClientRect() ?? null
    dragRef.current = {
      started: true,
      wasDragging: false,
      offX: e.clientX - cartBtnPosRef.current.x - (appRect?.left ?? 0),
      offY: e.clientY - cartBtnPosRef.current.y - (appRect?.top ?? 0),
      appRect,
    }
    window.addEventListener('pointermove', handleWindowPointerMove)
    window.addEventListener('pointerup', handleWindowPointerUp)
    e.preventDefault()
  }

  const handleWindowPointerMove = (e: PointerEvent) => {
    if (!dragRef.current.started || !dragRef.current.appRect) return
    const { appRect, offX, offY } = dragRef.current
    const APP_W = appRect.width
    const APP_H = appRect.height
    let newX = e.clientX - appRect.left - offX
    let newY = e.clientY - appRect.top - offY
    newX = Math.max(BTN_MARGIN, Math.min(APP_W - BTN_SIZE - BTN_MARGIN, newX))
    newY = Math.max(NAV_H, Math.min(APP_H - BTN_SIZE - BTN_MARGIN, newY))
    if (Math.abs(newX - cartBtnPosRef.current.x) > 2 || Math.abs(newY - cartBtnPosRef.current.y) > 2) {
      dragRef.current.wasDragging = true
    }
    cartBtnPosRef.current = { x: newX, y: newY }
    if (rafId == null) {
      rafId = requestAnimationFrame(() => {
        rafId = null
        setCartBtnPos({ ...cartBtnPosRef.current })
      })
    }
  }

  const handleWindowPointerUp = () => {
    dragRef.current.started = false
    window.removeEventListener('pointermove', handleWindowPointerMove)
    window.removeEventListener('pointerup', handleWindowPointerUp)
    if (rafId != null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    setCartBtnPos({ ...cartBtnPosRef.current })
  }

  const handleCartBtnClick = () => {
    if (dragRef.current.wasDragging) {
      dragRef.current.wasDragging = false
      return
    }
    toggleCart()
  }

  const handleCheckout = () => {
    setCartOpen(false)
    setCheckoutOpen(true)
  }

  const handlePayment = () => {
    setCart([])
    setCheckoutOpen(false)
  }

  const showCartButton = appVisible && cartCount > 0

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-stone-300">
      <div
        className="app-container relative overflow-hidden bg-[#F3ECE0] shadow-[0_40px_80px_-20px_rgba(26,18,8,0.45)]"
        style={{ width: '390px', height: '844px', borderRadius: '44px' }}
      >
        {appVisible && (
          <div className="absolute top-0 left-0 right-0 h-11 z-40 flex items-center justify-between px-8 bg-transparent pointer-events-none">
            <span className="font-body text-[11px] font-semibold text-stone-800 pointer-events-auto">9:41</span>
            <div className="flex gap-1.5 items-center pointer-events-auto">
              <div className="w-4 h-2 border border-stone-700 rounded-sm relative">
                <div className="absolute left-0.5 top-0.5 right-0.5 bottom-0.5 bg-stone-700 rounded-[1px]" />
              </div>
            </div>
          </div>
        )}

        <div className="absolute inset-0">
          {showScreen('splash') && (
            <div className="relative w-full h-full">
              <SplashScreen onEnter={() => goTo('explore')} />
            </div>
          )}

          <div className={`screen-wrap ${showScreen('explore') ? 'screen-visible' : 'screen-hidden'}`}>
            <div className={appVisible ? 'h-full pt-11' : 'h-full'}>
              <ExploreScreen
                hero={todayHero}
                countryData={currentCountryData}
                chefMealKey={todayHero.chefMealKey}
                onRecipe={(mealKey) => openMealByKey(mealKey, currentCountryData)}
                onStartJourney={beginTodayJourney}
                onSearchOpen={() => goTo('search')}
                onShopOpen={() => goTo('shop')}
                onShopCountry={(c) => { setShopCountry(c); goTo('shop') }}
              />
            </div>
          </div>

          <div className={`screen-wrap ${showScreen('today') ? 'screen-visible' : 'screen-hidden'}`}>
            <div className="h-full pt-0">
              <TodayScreen
                country={country}
                setCountry={setCountry}
                todayCountry={todayCountry}
                featuredMealKey={todayHero.featuredMealKey}
                onRecipe={(meal) => openRecipe(meal, COUNTRIES[country])}
                onBack={() => goTo('explore')}
                active={screen === 'today'}
              />
            </div>
          </div>

          <div className={`screen-wrap ${showScreen('cook') ? 'screen-visible' : 'screen-hidden'}`}>
            <div className="h-full pt-0">
              <CookScreen onRecipe={(meal, c) => openRecipe(meal, c)} todayCountry={todayCountry} />
            </div>
          </div>

          <div className={`screen-wrap ${showScreen('recipe') ? 'screen-visible' : 'screen-hidden'}`}>
            <div className="h-full pt-0">
              <RecipeScreen
                meal={recipeCtx.meal}
                country={recipeCtx.country}
                onBack={goBackFromRecipe}
                onAddToCart={addToCart}
                onRemoveFromCart={(id) => updateCartQuantity(id, -1)}
                onOpenShopItem={(it) => { setShopItemCtx(it); goTo('shop-item') }}
                cartItemIds={cartItemIds}
                onToggleCart={toggleCart}
              />
            </div>
          </div>

          <div className={`screen-wrap ${showScreen('me') ? 'screen-visible' : 'screen-hidden'}`}>
            <div className={appVisible ? 'h-full pt-11' : 'h-full'}>
              <MeScreen />
            </div>
          </div>

          <div className={`screen-wrap ${showScreen('search') ? 'screen-visible' : 'screen-hidden'}`}>
            <div className="h-full pt-11">
              <SearchScreen
                onBack={() => goTo('explore')}
                onRecipe={(meal, c) => openRecipe(meal, c)}
              />
            </div>
          </div>

          <div className={`screen-wrap ${showScreen('shop') ? 'screen-visible' : 'screen-hidden'}`}>
            <div className="h-full pt-0">
              <ShopScreen
                onBack={() => goTo('explore')}
                initialCountry={shopCountry}
                onItemDetail={openItemDetail}
                cart={cart}
                cartCount={cartCount}
                cartTotal={cartTotal}
                onAddToCart={addToCart}
                onUpdateCartQuantity={updateCartQuantity}
                justAddedId={justAddedId}
              />
            </div>
          </div>

          <div className={`screen-wrap ${showScreen('shop-item') ? 'screen-visible' : 'screen-hidden'}`}>
            <div className="h-full pt-0">
              {shopItemCtx && (
                <ShopItemDetailScreen
                  item={shopItemCtx}
                  onBack={goBackFromShopItem}
                  onNavigate={navigateItemDetail}
                  onAddToCart={addToCart}
                  onRemoveFromCart={(id) => updateCartQuantity(id, -1)}
                  justAddedId={justAddedId}
                  onBackToShop={() => { setScreen('shop') }}
                  cartItemIds={cartItemIds}
                />
              )}
            </div>
          </div>
        </div>

        {appVisible && screen !== 'recipe' && screen !== 'search' && screen !== 'shop-item' && (
          <BottomNav active={screen as Exclude<Screen, 'splash' | 'recipe' | 'search' | 'shop' | 'shop-item'>} onNav={goTo} />
        )}

        {/* ═══════════ 购物车浮动按钮（可拖拽） ═══════════ */}
        {showCartButton && (
          <button
            onPointerDown={handleCartBtnPointerDown}
            onClick={handleCartBtnClick}
            className={`absolute z-[90] w-12 h-12 rounded-full bg-[#E8650A] text-white flex items-center justify-center shadow-lg shadow-[#E8650A]/30 active:scale-90 transition-transform touch-none select-none cursor-grab active:cursor-grabbing ${
              cartBounce ? 'animate-cart-bounce' : ''
            } ${cartOpen ? 'rotate-45' : ''}`}
            style={{ left: cartBtnPos.x, top: cartBtnPos.y }}
          >
            <IconShoppingCart size={20} />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-[#E8650A] text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#E8650A]">
              {cartCount}
            </span>
          </button>
        )}

        {/* ═══════════ 购物车抽屉 ═══════════ */}
        {cartOpen && (
          <>
            <div
              className="absolute inset-0 z-[95] bg-black/40 backdrop-blur-sm animate-fade-in"
              onClick={() => setCartOpen(false)}
            />
            <div className="absolute inset-x-0 bottom-0 z-[96] bg-white rounded-t-3xl max-h-[70%] flex flex-col animate-slide-up" style={{ bottom: 0 }}>
              <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
                <div>
                  <p className="font-display text-[18px] font-bold text-stone-900">购物车</p>
                  <p className="text-stone-500 text-[11px] mt-0.5">{cartCount} 件商品</p>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors"
                >
                  <IconX size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-3">
                {cart.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-stone-400 text-sm">购物车是空的</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((ci) => (
                      <div key={ci.item.id} className="flex items-center gap-3 py-2 border-b border-stone-100 last:border-0">
                        <div className="w-14 h-14 rounded-xl bg-stone-100 overflow-hidden shrink-0">
                          <img src={ci.item.img} alt={ci.item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-display text-[13px] font-bold text-stone-900 truncate">{ci.item.cn}</p>
                          <p className="text-stone-500 text-[10px] mt-0.5">¥{ci.item.price} / {ci.item.unit}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <button
                              onClick={() => updateCartQuantity(ci.item.id, -1)}
                              className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-colors"
                            >
                              <IconMinus size={10} />
                            </button>
                            <span className="font-display text-[13px] font-bold text-stone-900 w-5 text-center">{ci.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(ci.item.id, 1)}
                              className="w-6 h-6 rounded-full bg-[#E8650A] text-white flex items-center justify-center hover:bg-[#D45A09] transition-colors"
                            >
                              <IconPlus size={10} />
                            </button>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-display text-[15px] font-black text-[#E8650A]">¥{ci.item.price * ci.quantity}</p>
                          <button
                            onClick={() => removeFromCart(ci.item.id)}
                            className="text-stone-400 text-[10px] mt-1 hover:text-stone-600 transition-colors"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="px-5 py-4 border-t border-stone-200 bg-[#F3ECE0]/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-stone-600 text-sm">合计</span>
                    <span className="font-display text-[22px] font-black text-[#E8650A]">¥{cartTotal}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3.5 bg-[#E8650A] text-white rounded-2xl text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-[#D45A09] active:scale-[0.98] transition-all shadow-lg shadow-[#E8650A]/30"
                  >
                    结算 · Checkout
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* ═══════════ 结算弹窗 ═══════════ */}
        {checkoutOpen && (
          <>
            <div
              className="absolute inset-0 z-[97] bg-black/50 backdrop-blur-sm animate-fade-in"
              onClick={() => setCheckoutOpen(false)}
            />
            <div className="absolute left-1/2 top-1/2 z-[98] -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-6 shadow-2xl w-[340px] animate-pop-in">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[9px] tracking-[0.3em] uppercase text-stone-400 mb-1">Checkout</p>
                  <h3 className="font-display text-[22px] font-black text-stone-900 leading-tight">确认订单</h3>
                </div>
                <button
                  onClick={() => setCheckoutOpen(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-stone-100 text-stone-500 transition-colors"
                >
                  <IconX size={14} />
                </button>
              </div>

              <div className="space-y-2 mb-5 max-h-[200px] overflow-y-auto">
                {cart.map((ci) => (
                  <div key={ci.item.id} className="flex justify-between text-sm">
                    <span className="text-stone-700 truncate mr-2">{ci.item.cn} × {ci.quantity}</span>
                    <span className="font-bold text-stone-900 shrink-0">¥{ci.item.price * ci.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-stone-200 pt-3 mb-5">
                <div className="flex justify-between items-center">
                  <span className="text-stone-600">合计</span>
                  <span className="font-display text-[24px] font-black text-[#E8650A]">¥{cartTotal}</span>
                </div>
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={() => setCheckoutOpen(false)}
                  className="flex-1 py-3 rounded-2xl bg-stone-100 text-stone-700 text-[10px] tracking-[0.25em] uppercase font-bold hover:bg-stone-200 active:scale-[0.98] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  className="flex-1 py-3 rounded-2xl bg-[#E8650A] text-white text-[10px] tracking-[0.25em] uppercase font-bold hover:bg-[#D45A09] active:scale-[0.98] transition-all shadow-md shadow-[#E8650A]/30"
                >
                  Pay · 支付
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}