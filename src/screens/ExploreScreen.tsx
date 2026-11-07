import { useState, useRef, useEffect } from 'react'
import {
  IconArrowRight, IconSearch, IconBookmark, IconChef, IconBag,
  Parallax, Eyebrow, Reveal,
} from '../components'
import { type HeroData, type CountryData, DESTINATIONS } from '../data'
import type { MealKey } from '../types'

function altSnackKey(primary: MealKey): MealKey {
  return primary === 'streetFood' ? 'snack' : 'streetFood'
}

export function ExploreScreen({ hero, countryData, chefMealKey, onRecipe, onStartJourney, onSearchOpen, onShopOpen, onShopCountry }: {
  hero: HeroData
  countryData: CountryData
  chefMealKey: MealKey
  onRecipe: (mealKey: MealKey) => void
  onStartJourney: () => void
  onSearchOpen: () => void
  onShopOpen: () => void
  onShopCountry: (countryId: string) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [stick, setStick] = useState(false)

  const featuredMeal = countryData[chefMealKey]
  const chefMeal = countryData[altSnackKey(chefMealKey)]

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => setStick(el.scrollTop > 360)
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto pb-24 bg-[#F3ECE0] relative">
      <div className={`sticky top-0 z-20 transition-all duration-500 ${stick ? 'glass-nav py-3 border-b border-stone-300/40' : 'bg-transparent py-5'}`}>
        <div className="px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#1A1208] flex items-center justify-center">
              <span className="text-[#E8650A] text-[10px] font-bold">FA</span>
            </div>
            <span className="text-stone-700 text-[11px] tracking-[0.3em] uppercase">Flavor Atlas</span>
          </div>
          <div className="flex items-center gap-3 text-stone-600">
            <button
              onClick={onSearchOpen}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-200/60 active:scale-90 transition-colors"
              aria-label="搜索"
            >
              <IconSearch size={18} />
            </button>
            <button
              onClick={onShopOpen}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-200/60 active:scale-90 transition-colors"
              aria-label="商店"
            >
              <IconBag size={18} />
            </button>
            <IconBookmark size={18} />
          </div>
        </div>
      </div>

      <section className="relative bg-[#F3ECE0] pb-6">
        <Reveal>
          <div className="px-6 pt-4 flex items-center gap-2 mb-5">
            <span className="text-[10px] tracking-[0.3em] uppercase text-stone-500">Chapter 01</span>
            <span className="text-stone-400">·</span>
            <span className="text-[10px] tracking-[0.3em] uppercase text-stone-500">{hero.dayLabel}'s Destination</span>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative h-[400px] mx-4 rounded-[32px] overflow-hidden group cursor-pointer" onClick={onStartJourney}>
            <Parallax src={hero.heroImg} alt={hero.country} scrollRef={scrollRef} speed={0.22} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            <div className="absolute top-5 right-5 text-white/70 text-[9px] tracking-widest text-right leading-tight">
              {hero.latLng}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center gap-2 text-[10px] tracking-[0.4em] uppercase text-[#E8650A]/90 mb-2">
                <span className="w-4 h-px bg-[#E8650A]" />
                {hero.heroSubtitle}
              </div>
              <h2 className="font-display text-[48px] font-black leading-[0.92] tracking-tight">{hero.country.charAt(0).toUpperCase() + hero.country.slice(1)}</h2>
              <p className="font-display italic text-white/85 text-[18px] mt-1 leading-tight">{hero.description}</p>
              <div className="mt-5 flex items-center gap-3">
                <button onClick={(e) => { e.stopPropagation(); onStartJourney() }} className="bg-transparent border border-white/60 text-white text-[11px] tracking-[0.25em] uppercase px-5 py-3 rounded-full flex items-center gap-2 active:scale-95 hover:bg-white/10 transition-all backdrop-blur-sm">
                  Begin Today's Journey <IconArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="px-6 mt-4 flex gap-4 items-start">
            <span className="font-display text-[40px] leading-none text-[#E8650A]/60 -mt-1">"</span>
            <p className="font-display italic text-stone-700 text-[15px] leading-relaxed flex-1">
              {hero.quote}
            </p>
          </div>
        </Reveal>
      </section>

      <section className="bg-[#F3ECE0] py-8">
        <Reveal>
          <div className="px-6">
            <Eyebrow num="02">From the Atlas</Eyebrow>
            <div className="flex items-baseline justify-between mt-3 mb-8">
              <h3 className="font-display text-[40px] font-black text-stone-900 leading-[0.95] tracking-tight">{featuredMeal.en}</h3>
              <div className="text-right">
                <p className="font-display text-[48px] font-black text-[#E8650A] leading-none">{featuredMeal.kcal}</p>
                <p className="text-stone-400 text-[10px] tracking-widest">Kcal</p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="relative mx-6 rounded-[32px] overflow-hidden h-[300px] cursor-pointer group active:scale-[0.98] transition-transform" onClick={() => onRecipe(chefMealKey)}>
            <img src={featuredMeal.img} alt={featuredMeal.en} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute top-4 left-4 bg-white/90 text-stone-900 text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full">{hero.heroSubtitle}</div>
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="font-display text-[14px] text-white/90">{featuredMeal.cn}</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="px-6 mt-8">
            <p className="font-display text-[18px] italic text-stone-600 leading-none mb-2">Kitchen Story<span className="text-stone-400 text-[14px]"> · 厨房故事</span></p>
            <p className="text-stone-700 text-[15px] leading-[1.8]">
              {featuredMeal.story}
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="border-t-2 border-stone-800 pt-2">
                <p className="font-display text-[22px] font-bold leading-none text-stone-900">{featuredMeal.time}</p>
                <p className="text-stone-500 text-[10px] tracking-widest uppercase mt-1">Time</p>
              </div>
              <div className="border-t-2 border-stone-800 pt-2">
                <p className="font-display text-[22px] font-bold leading-none text-stone-900">{featuredMeal.difficulty}</p>
                <p className="text-stone-500 text-[10px] tracking-widest uppercase mt-1">Level</p>
              </div>
              <div className="border-t-2 border-stone-800 pt-2">
                <p className="font-display text-[22px] font-bold leading-none text-stone-900">¥{featuredMeal.price}</p>
                <p className="text-stone-500 text-[10px] tracking-widest uppercase mt-1">Price</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="relative bg-[#1A1208] py-14 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#E8650A]/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#C9A84C]/10 blur-3xl" />
        <div className="relative">
          <Reveal>
            <div className="flex items-center gap-3 text-[10px] tracking-[0.4em] uppercase text-[#E8650A] mb-8">
              <IconChef size={16} /><span>Chef's Letter · 主厨来信</span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-10 h-10 rounded-full bg-[#E8650A]/20 flex items-center justify-center border border-[#E8650A]/40">
                <IconChef size={18} stroke="#E8650A" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">{hero.chefName}</p>
                <p className="text-white/50 text-[11px]">{hero.chefTitle}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="relative border-l-2 border-[#E8650A]/40 pl-4 ml-2">
              <p className="font-display italic text-[18px] text-white/90 leading-relaxed">
                {hero.chefLetter}
              </p>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-8 flex items-start gap-5">
              <div className="flex-1 bg-white p-3 rounded-sm shadow-lg transition-transform duration-500 hover:rotate-0 cursor-pointer active:scale-[0.98] group" style={{ transform: 'rotate(-2deg)' }} onClick={() => onRecipe(altSnackKey(chefMealKey))}>
                <img src={chefMeal.img} alt={chefMeal.en} className="w-full h-[160px] object-cover" />
                <p className="font-display text-stone-800 text-center text-[16px] mt-1">{chefMeal.en}</p>
                <p className="font-display text-stone-500 text-center text-[12px]">{chefMeal.cn}</p>
              </div>
              <div className="w-[42%] pt-2">
                <p className="text-white/70 text-[10px] tracking-[0.3em] uppercase">Chef's Pick</p>
                <h4 className="font-display text-[24px] text-white font-bold leading-tight mt-1">Signature<br/>Dish</h4>
                <div className="mt-4 space-y-2 text-[12px] text-white/70">
                  <div className="flex justify-between"><span className="text-white/40">Time</span><span>{chefMeal.time}</span></div>
                  <div className="flex justify-between"><span className="text-white/40">Level</span><span>{chefMeal.difficulty}</span></div>
                  <div className="flex justify-between"><span className="text-white/40">Price</span><span>¥{chefMeal.price}</span></div>
                </div>
                <button onClick={() => onRecipe(altSnackKey(chefMealKey))} className="mt-5 bg-transparent border border-white/60 text-white text-[11px] tracking-[0.25em] uppercase px-5 py-3 rounded-full flex items-center gap-2 active:scale-95 hover:bg-white/10 transition-all backdrop-blur-sm">
                  Open Recipe <IconArrowRight size={14} />
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#F3ECE0] pt-10 pb-8">
        <Reveal>
          <div className="px-6 flex items-baseline justify-between">
            <div>
              <Eyebrow num="03">More Destinations</Eyebrow>
              <h3 className="font-display text-[24px] font-bold text-stone-900 mt-2">The Long List</h3>
            </div>
            <button onClick={() => onShopCountry('all')} className="text-[11px] tracking-widest uppercase text-stone-600 flex items-center gap-1 hover:text-[#E8650A] transition-colors">All <IconArrowRight size={12} /></button>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="mt-6 flex gap-4 overflow-x-auto px-6 pb-3">
            {DESTINATIONS.map((d, i) => (
              <div key={d.id} className="flex-shrink-0 cursor-pointer" style={{ width: '150px', transform: `${[ '-2deg', '1deg', '-1deg', '2deg', '-2deg' ][i]}` }} onClick={() => onShopCountry(d.id)}>
                <div className="bg-white/80 backdrop-blur-md p-2 rounded-sm shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-white/40">
                  <img src={d.img} alt={d.en} className="w-full h-[140px] object-cover" />
                  <div className="px-1 pt-2 pb-1">
                    <p className="text-stone-400 text-[9px] tracking-[0.3em] uppercase">{d.tag}</p>
                    <p className="font-display text-[17px] font-bold text-stone-900 leading-tight">{d.en}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
    </div>
  )
}