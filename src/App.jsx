import { useEffect, useMemo, useRef, useState } from 'react'
import {
  BottomNav,
  CartDrawer,
  CheckoutModal,
  FloatingCartButton,
  StatusBar,
} from './components'
import { COUNTRIES, getDailyHeroData } from './data'
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

  const [screen, setScreen] = useState('splash')
  const [country, setCountry] = useState(todayCountry)
  const prevScreenRef = useRef('explore')
  const [shopCountry, setShopCountry] = useState('all')
  const [shopItemCtx, setShopItemCtx] = useState(null)
  const [shopItemHistory, setShopItemHistory] = useState([])
  const [justAddedId, setJustAddedId] = useState(null)
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [cartBounce, setCartBounce] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      if (!saved) return
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) setCart(parsed)
    } catch { /* 忽略损坏的本地缓存 */ }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch { /* 隐私模式下可能不可用 */ }
  }, [cart])

  const [recipeCtx, setRecipeCtx] = useState(() => {
    const c = COUNTRIES[todayCountry]
    return { meal: c[todayHero.chefMealKey], country: c }
  })

  const cartTotal = cart.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0)
  const cartCount = cart.reduce((sum, entry) => sum + entry.quantity, 0)
  const cartItemIds = useMemo(() => new Set(cart.map((entry) => entry.item.id)), [cart])
  const currentCountryData = COUNTRIES[todayCountry]

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((entry) => entry.item.id === item.id)
      if (existing) {
        return prev.map((entry) => (
          entry.item.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry
        ))
      }
      return [...prev, { item, quantity: 1 }]
    })
    setJustAddedId(item.id)
    setCartBounce(true)
    window.setTimeout(() => setJustAddedId(null), 1500)
    window.setTimeout(() => setCartBounce(false), 400)
  }

  const updateCartQuantity = (itemId, delta) => {
    setCart((prev) => prev
      .map((entry) => (
        entry.item.id === itemId ? { ...entry, quantity: Math.max(0, entry.quantity + delta) } : entry
      ))
      .filter((entry) => entry.quantity > 0))
  }

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((entry) => entry.item.id !== itemId))
  }

  const goTo = (nextScreen) => {
    if (nextScreen === 'recipe' || nextScreen === 'shop-item') {
      prevScreenRef.current = screen
    }
    if (nextScreen === 'today' && screen !== 'today') {
      setCountry(todayCountry)
    }
    setScreen(nextScreen)
  }

  const openItemDetail = (item) => {
    setShopItemHistory([])
    setShopItemCtx(item)
    goTo('shop-item')
  }

  const navigateItemDetail = (item) => {
    setShopItemHistory((prev) => (shopItemCtx ? [...prev, shopItemCtx] : prev))
    setShopItemCtx(item)
  }

  const goBackFromShopItem = () => {
    if (shopItemHistory.length > 0) {
      const prev = shopItemHistory[shopItemHistory.length - 1]
      setShopItemHistory((history) => history.slice(0, -1))
      setShopItemCtx(prev)
      return
    }
    setScreen(prevScreenRef.current || 'shop')
  }

  const openRecipe = (meal, countryData) => {
    setRecipeCtx({ meal, country: countryData })
    goTo('recipe')
  }

  const openMealByKey = (mealKey, countryData) => {
    openRecipe(countryData[mealKey], countryData)
  }

  const handleCheckout = () => {
    setCartOpen(false)
    setCheckoutOpen(true)
  }

  const handlePayment = () => {
    setCart([])
  }

  const appVisible = screen !== 'splash'
  const showCartButton = appVisible && cartCount > 0
  const navVisible = appVisible && !['recipe', 'search', 'shop-item', 'shop'].includes(screen)

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-stone-300">
      <div
        ref={containerRef}
        className="app-container relative overflow-hidden bg-[#F3ECE0] shadow-[0_40px_80px_-20px_rgba(26,18,8,0.45)]"
        style={{ width: '390px', height: '844px', borderRadius: '44px' }}
      >
        {appVisible && <StatusBar />}

        <div className="absolute inset-0">
          {screen === 'splash' && (
            <div className="relative w-full h-full">
              <SplashScreen onEnter={() => goTo('explore')} />
            </div>
          )}

          <div className={`screen-wrap ${screen === 'explore' ? 'screen-visible' : 'screen-hidden'}`}>
            <div className={appVisible ? 'h-full pt-11' : 'h-full'}>
              <ExploreScreen
                hero={todayHero}
                countryData={currentCountryData}
                chefMealKey={todayHero.chefMealKey}
                onRecipe={(mealKey) => openMealByKey(mealKey, currentCountryData)}
                onStartJourney={() => goTo('today')}
                onSearchOpen={() => goTo('search')}
                onShopOpen={() => goTo('shop')}
                onShopCountry={(id) => { setShopCountry(id); goTo('shop') }}
              />
            </div>
          </div>

          <div className={`screen-wrap ${screen === 'today' ? 'screen-visible' : 'screen-hidden'}`}>
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

          <div className={`screen-wrap ${screen === 'cook' ? 'screen-visible' : 'screen-hidden'}`}>
            <div className="h-full pt-0">
              <CookScreen onRecipe={openRecipe} todayCountry={todayCountry} />
            </div>
          </div>

          <div className={`screen-wrap ${screen === 'recipe' ? 'screen-visible' : 'screen-hidden'}`}>
            <div className="h-full pt-0">
              <RecipeScreen
                meal={recipeCtx.meal}
                country={recipeCtx.country}
                onBack={() => setScreen(prevScreenRef.current || 'explore')}
                onAddToCart={addToCart}
                onRemoveFromCart={removeFromCart}
                onOpenShopItem={openItemDetail}
                cartItemIds={cartItemIds}
                onToggleCart={() => setCartOpen(true)}
              />
            </div>
          </div>

          <div className={`screen-wrap ${screen === 'me' ? 'screen-visible' : 'screen-hidden'}`}>
            <div className={appVisible ? 'h-full pt-11' : 'h-full'}>
              <MeScreen />
            </div>
          </div>

          <div className={`screen-wrap ${screen === 'search' ? 'screen-visible' : 'screen-hidden'}`}>
            <div className="h-full pt-11">
              <SearchScreen
                onBack={() => goTo('explore')}
                onRecipe={openRecipe}
              />
            </div>
          </div>

          <div className={`screen-wrap ${screen === 'shop' ? 'screen-visible' : 'screen-hidden'}`}>
            <div className="h-full pt-0">
              <ShopScreen
                onBack={() => goTo('explore')}
                initialCountry={shopCountry}
                onItemDetail={openItemDetail}
                onAddToCart={addToCart}
                justAddedId={justAddedId}
              />
            </div>
          </div>

          <div className={`screen-wrap ${screen === 'shop-item' ? 'screen-visible' : 'screen-hidden'}`}>
            <div className="h-full pt-0">
              {shopItemCtx && (
                <ShopItemDetailScreen
                  item={shopItemCtx}
                  onBack={goBackFromShopItem}
                  onNavigate={navigateItemDetail}
                  onAddToCart={addToCart}
                  onRemoveFromCart={removeFromCart}
                  onBackToShop={() => setScreen('shop')}
                  cartItemIds={cartItemIds}
                />
              )}
            </div>
          </div>
        </div>

        {navVisible && (
          <BottomNav active={screen} onNav={goTo} />
        )}

        {showCartButton && (
          <FloatingCartButton
            containerRef={containerRef}
            count={cartCount}
            open={cartOpen}
            bounce={cartBounce}
            onToggle={() => setCartOpen((value) => !value)}
          />
        )}

        {cartOpen && (
          <CartDrawer
            cart={cart}
            count={cartCount}
            total={cartTotal}
            onClose={() => setCartOpen(false)}
            onUpdateQuantity={updateCartQuantity}
            onRemove={removeFromCart}
            onCheckout={handleCheckout}
            onOpenItem={openItemDetail}
          />
        )}

        {checkoutOpen && (
          <CheckoutModal
            cart={cart}
            total={cartTotal}
            onClose={() => setCheckoutOpen(false)}
            onPay={handlePayment}
          />
        )}
      </div>
    </div>
  )
}
