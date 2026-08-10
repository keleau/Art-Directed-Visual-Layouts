import {
  IconLeaf, IconCheck, IconChef, IconArrowRight,
  Eyebrow, Stamp, Reveal,
} from '../components'
import { type Meal, type CountryData, IMGS, COUNTRIES } from '../data'

export function CookScreen({ onRecipe, todayCountry }: { onRecipe: (meal: Meal, country: CountryData) => void; todayCountry: keyof typeof COUNTRIES }) {
  const countryIds = ['japan', 'italy', 'mexico', 'france', 'thailand', 'china'] as const
  const todayIdx = countryIds.indexOf(todayCountry)
  const nextCountry = countryIds[(todayIdx + 1) % countryIds.length]
  const thirdCountry = countryIds[(todayIdx + 2) % countryIds.length]
  const featuredMeal = COUNTRIES[nextCountry].lunch
  const dinnerMeal = COUNTRIES[nextCountry].dinner
  const seasonal = COUNTRIES[thirdCountry]
  const seasonalMeal = seasonal.dinner
  return (
    <div className="h-full overflow-y-auto pb-24 bg-[#EBE3D3]">
      <section className="relative h-[340px] overflow-hidden">
        <img src={IMGS.cookingHero} alt="Cooking" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-[#1A1208]/95" />
        <div className="absolute top-5 left-6 right-6 flex items-start justify-between text-white">
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#E8650A] font-semibold">Issue № 03 · Cookbook</p>
            <p className="font-display italic text-[13px] text-white/70 mt-1">Sourced · Seasoned · Served</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] tracking-[0.35em] uppercase text-white/60">Vol. 03</p>
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/60 mt-0.5">Summer 2026</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h1 className="font-display text-[76px] font-black leading-[0.88] tracking-tight">Cook</h1>
                <h2 className="font-display italic text-[17px] text-white/75 leading-tight mt-1">A kitchen in every pocket.</h2>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#F3ECE0] py-12 px-8 flex flex-col items-center text-center">
        <Reveal>
          <div className="flex items-center gap-4 text-[#8B7355]">
            <span className="h-px w-10 bg-[#8B7355]/50" />
            <IconLeaf size={20} stroke="#8B7355" />
            <span className="h-px w-10 bg-[#8B7355]/50" />
          </div>
          <p className="font-display italic text-[20px] text-stone-700 leading-[1.7] mt-5 max-w-[320px]">
            Premium ingredients, sourced from artisan producers.<br/>
            Each kit tells the story of its origin.
          </p>
          <p className="font-hand text-[22px] text-stone-500 mt-4">— The Cookbook</p>
        </Reveal>
      </section>

      <section className="px-6 py-8 bg-[#EBE3D3]">
        <Reveal>
          <Eyebrow num="01">Featured This Week</Eyebrow>
          <div className="mt-3 flex items-end justify-between">
            <h3 className="font-display text-[34px] font-black text-stone-900 leading-[0.95]">Today's Kit</h3>
            <span className="font-hand text-[22px] text-stone-500">N°1 →</span>
          </div>
        </Reveal>
      </section>

      <section className="bg-[#F3ECE0] py-8">
        <Reveal>
          <div className="mx-6 bg-white rounded-[28px] shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer active:scale-[0.99] group" onClick={() => onRecipe(featuredMeal, COUNTRIES[nextCountry])}>
            <div className="flex" style={{ height: '240px' }}>
              <div className="relative overflow-hidden flex-shrink-0" style={{ width: '55%' }}>
                <img src={featuredMeal.img} alt={featuredMeal.en} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-3 left-3 bg-[#E8650A] text-white text-[9px] tracking-[0.3em] uppercase px-2.5 py-1 rounded">New · 今日</div>
              </div>
              <div className="flex-1 px-5 py-5 flex flex-col justify-between">
                <div>
                  <p className="text-[#E8650A] text-[10px] tracking-widest uppercase mb-2">{COUNTRIES[nextCountry].name} · {COUNTRIES[nextCountry].cn}</p>
                  <h4 className="font-display text-[22px] font-bold text-stone-900 leading-tight">{featuredMeal.en} Kit</h4>
                  <p className="text-stone-500 text-[12px] mt-1">{featuredMeal.cn}</p>
                </div>
                <div className="space-y-1.5 text-[12px]">
                  <div className="flex justify-between border-t border-stone-200 pt-2"><span className="text-stone-500">Time</span><span className="text-stone-900 font-medium">{featuredMeal.time}</span></div>
                  <div className="flex justify-between"><span className="text-stone-500">Difficulty</span><span className="text-stone-900 font-medium">{featuredMeal.difficulty}</span></div>
                  <div className="flex justify-between"><span className="text-stone-500">Serves</span><span className="text-stone-900 font-medium">2 people</span></div>
                  <div className="flex justify-between"><span className="text-stone-500">Price</span><span className="text-[#E8650A] font-bold">¥ {featuredMeal.price}</span></div>
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-stone-200 flex items-center justify-between bg-stone-50">
              <p className="text-stone-600 text-[11px] flex items-center gap-2">
                <IconCheck size={14} stroke="#4A6741" />
                Includes: {featuredMeal.recipe.ingredients.slice(0, 3).map(i => i.t.split(',')[0]).join(', ')}
              </p>
              <span className="bg-[#1A1208]/10 border border-[#1A1208]/30 text-[#1A1208] text-[10px] tracking-[0.3em] uppercase px-4 py-2.5 rounded-full transition-colors">Explore →</span>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="bg-[#D9C7A8] py-12 px-6">
        <Reveal>
          <Eyebrow num="02">Ingredient Story</Eyebrow>
          <h3 className="font-display text-[32px] font-black text-stone-900 leading-[0.95] mt-3">What's Inside<br/>the Box?</h3>
          <p className="font-hand text-stone-700 text-[20px] mt-2">Box contents —</p>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-6 relative h-[320px]">
            <div className="absolute top-0 left-0 w-[55%] h-[55%] bg-white p-3 rounded-sm shadow-md hover:rotate-0 transition-transform duration-500" style={{ transform: 'rotate(-2deg)' }}>
              <img src={IMGS.tomatoes} alt="Tomatoes" className="w-full h-full object-cover" />
              <p className="font-hand text-center text-stone-800 text-[16px] mt-1">San Marzano, DOP</p>
            </div>
            <div className="absolute top-8 right-0 w-[50%] h-[48%] bg-white p-3 rounded-sm shadow-md hover:rotate-0 transition-transform duration-500" style={{ transform: 'rotate(2deg)' }}>
              <img src={IMGS.spices} alt="Spices" className="w-full h-full object-cover" />
              <p className="font-hand text-center text-stone-800 text-[16px] mt-1">Sicilian spice blend</p>
            </div>
            <div className="absolute bottom-0 left-[10%] w-[52%] h-[48%] bg-white p-3 rounded-sm shadow-md hover:rotate-0 transition-transform duration-500" style={{ transform: 'rotate(-1deg)' }}>
              <img src={IMGS.market} alt="Market" className="w-full h-full object-cover" />
              <p className="font-hand text-center text-stone-800 text-[16px] mt-1">Market, this morning</p>
            </div>
            <div className="absolute bottom-2 right-4 w-[38%] h-[45%] bg-white p-3 rounded-sm shadow-md hover:rotate-0 transition-transform duration-500" style={{ transform: 'rotate(3deg)' }}>
              <img src={IMGS.vegetables} alt="Vegetables" className="w-full h-full object-cover" />
              <p className="font-hand text-center text-stone-800 text-[16px] mt-1">Heirloom vegetables</p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="relative h-[440px] cursor-pointer active:scale-[0.99] group" onClick={() => onRecipe(dinnerMeal, COUNTRIES[nextCountry])}>
        <img src={dinnerMeal.img} alt={dinnerMeal.en} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1208] via-[#1A1208]/70 to-transparent" />
        <div className="absolute top-4 right-5"><Stamp country={COUNTRIES[nextCountry].flag} year="EST. 2026" rotate={-8} active /></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <Reveal>
            <div className="flex items-center gap-2 text-[10px] tracking-[0.4em] uppercase text-[#E8650A] mb-2">
              <IconChef size={14}/> Chef's Choice · 主厨精选
            </div>
            <h3 className="font-display text-[52px] font-black leading-[0.9] tracking-tight">{dinnerMeal.en}</h3>
            <p className="font-display italic text-white/80 text-[17px] mt-1">{dinnerMeal.cn}</p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-2">
                <span className="bg-white/20 backdrop-blur border border-white/30 text-white text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full">{dinnerMeal.time}</span>
                <span className="bg-white/20 backdrop-blur border border-white/30 text-white text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full">{dinnerMeal.difficulty}</span>
              </div>
              <p className="font-display text-[28px] font-bold text-[#E8650A]">¥ {dinnerMeal.price}</p>
            </div>
            <div className="mt-5 bg-transparent border border-white/70 text-white text-[11px] tracking-[0.3em] uppercase px-6 py-3 rounded-full flex items-center gap-2 self-start w-fit backdrop-blur-sm">
              Begin the Workshop <IconArrowRight size={14} />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#B8C5B3] py-10">
        <Reveal>
          <div className="px-6">
            <Eyebrow num="03">Seasonal Recommendation</Eyebrow>
            <p className="font-hand text-stone-700 text-[20px] mt-3">Season's pick —</p>
          </div>
          <div className="px-6 mt-5 flex gap-4 items-center cursor-pointer active:scale-[0.99] group" onClick={() => onRecipe(seasonalMeal, seasonal)}>
            <div className="flex-shrink-0 w-[44%] h-[180px] rounded-[24px] overflow-hidden">
              <img src={seasonalMeal.img} alt={seasonal.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="flex-1">
              <p className="text-[#4A6741] text-[10px] tracking-[0.3em] uppercase">{seasonal.flag} {seasonal.name} · {seasonal.cn}</p>
              <h4 className="font-display text-[24px] font-bold text-[#2A3D28] leading-tight mt-1">{seasonalMeal.en}</h4>
              <p className="text-[#2A3D28]/80 text-[12px] mt-1">{seasonalMeal.cn}</p>
              <div className="mt-3 flex items-center gap-3">
                <p className="font-display text-[20px] font-bold text-[#4A6741]">¥ {seasonalMeal.price}</p>
                <span className="bg-[#2A3D28] text-white text-[9px] tracking-[0.3em] uppercase px-3 py-2 rounded-full transition-colors">Explore</span>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="bg-[#F3ECE0] py-10 px-6">
        <Reveal>
          <Eyebrow num="04">Cooking Tips</Eyebrow>
          <h3 className="font-display text-[28px] font-black text-stone-900 leading-[0.95] mt-3">From the Kitchen</h3>
        </Reveal>
        <div className="mt-6 space-y-5">
          {[
            { n: '01', t: 'Salt Early', d: 'Season as you go, not at the end.' },
            { n: '02', t: 'Heat the Pan', d: 'A hot pan is the first ingredient.' },
            { n: '03', t: 'Taste Often', d: 'Your tongue is the best tool.' },
          ].map((tip, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className="flex items-start gap-4">
                <p className="font-display text-[32px] font-black text-[#E8650A]/50 leading-none">{tip.n}</p>
                <div className="flex-1 border-b border-stone-300 pb-4">
                  <p className="font-display text-[18px] font-bold text-stone-900">{tip.t}</p>
                  <p className="text-stone-500 text-sm mt-1">{tip.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}