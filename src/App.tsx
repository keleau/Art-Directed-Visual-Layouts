import { useState, useRef, useMemo } from 'react'
import { BottomNav } from './components'
import type { Screen, Country, Meal, MealKey, CountryData } from './types'
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

export default function App() {
  const todayHero = useMemo(() => getDailyHeroData(), [])
  const todayCountry = todayHero.country

  const [screen, setScreen] = useState<Screen>('splash')
  const [country, setCountry] = useState<Country>(todayCountry)
  const prevScreenRef = useRef<Screen>('explore')

  const [recipeCtx, setRecipeCtx] = useState<{ meal: Meal; country: CountryData }>(() => {
    const c = COUNTRIES[todayCountry]
    return { meal: c[todayHero.chefMealKey], country: c }
  })

  const goTo = (s: Screen) => {
    if (s === 'recipe') {
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

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-stone-300">
      <div
        className="relative overflow-hidden bg-[#F3ECE0] shadow-[0_40px_80px_-20px_rgba(26,18,8,0.45)]"
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
              <ShopScreen onBack={() => goTo('explore')} />
            </div>
          </div>
        </div>

        {appVisible && screen !== 'recipe' && screen !== 'search' && (
          <BottomNav active={screen as Exclude<Screen, 'splash' | 'recipe' | 'search'>} onNav={goTo} />
        )}
      </div>
    </div>
  )
}