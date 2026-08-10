import {
  IconArrowRight, IconBookmark, IconPin, IconCheck, IconChef, IconPan,
  Eyebrow, Reveal,
} from '../components'
import { type Meal, type CountryData } from '../data'

export function RecipeScreen({ meal, country, onBack }: { meal: Meal; country: CountryData; onBack: () => void }) {
  const macros = meal.macros
  return (
    <div className="h-full overflow-y-auto pb-20 bg-[#F3ECE0]">

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative h-[380px]">
        <img src={meal.img} alt={meal.en} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-black/90" />

        <div className="absolute top-9 left-5 right-5 z-10 flex items-center justify-between text-white">
          <button onClick={onBack} className="flex items-center gap-1.5 text-white/90 bg-black/25 backdrop-blur px-3 py-1.5 rounded-full text-[11px] tracking-[0.2em] uppercase hover:bg-black/40 transition-colors">
            <IconArrowRight size={12} style={{ transform: 'rotate(180deg)' }} /> Back
          </button>
          <button className="w-9 h-9 rounded-full bg-black/25 backdrop-blur flex items-center justify-center hover:bg-black/40 transition-colors">
            <IconBookmark size={16} stroke="#fff" />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <Reveal>
            <div className="flex items-center gap-1.5 text-[9px] tracking-[0.35em] uppercase text-[#E8650A] mb-1.5">
              <IconPin size={11} /> {country.name} · {country.cn}
            </div>
            <h1 className="font-display text-[44px] font-black leading-[0.9] tracking-tight">{meal.en}</h1>
            <p className="font-display italic text-white/75 text-[16px] mt-0.5">{meal.cn}</p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ FLOATING STATS BAR ═══════════ */}
      <section className="px-5 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-[0_10px_30px_-12px_rgba(26,18,8,0.15)] border border-stone-200/70 px-5 py-4">
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { k: meal.kcal, v: 'kcal' },
              { k: meal.time, v: 'time' },
              { k: meal.difficulty, v: 'level' },
              { k: meal.taste.split('·')[0].trim(), v: 'taste' },
            ].map((m, i) => (
              <div key={i}>
                <p className="font-display text-[20px] font-bold text-stone-900 leading-none">{m.k}</p>
                <p className="text-stone-500 text-[8px] tracking-[0.25em] uppercase mt-1.5">{m.v}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-stone-200 grid grid-cols-3 gap-3 text-center">
            {[
              { k: macros.protein, v: 'Protein', c: 'text-[#E8650A]' },
              { k: macros.carbs,   v: 'Carbs',   c: 'text-[#2A3D28]' },
              { k: macros.fats,    v: 'Fats',    c: 'text-[#7A5C3E]' },
            ].map((m, i) => (
              <div key={i}>
                <p className={`font-display text-[14px] font-bold leading-none ${m.c}`}>{m.k}</p>
                <p className="text-stone-500 text-[8px] tracking-[0.2em] uppercase mt-1">{m.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ STORY ═══════════ */}
      <section className="px-5 pt-7">
        <Reveal>
          <Eyebrow num="01">The Dish</Eyebrow>
          <p className="font-display italic text-stone-800 text-[18px] leading-[1.55] mt-3">{meal.story}</p>
        </Reveal>
      </section>

      {/* ═══════════ INGREDIENTS ═══════════ */}
      <section className="px-5 pt-7">
        <Reveal>
          <div className="flex items-baseline justify-between">
            <Eyebrow num="02">Ingredients</Eyebrow>
            <p className="font-display text-stone-500 text-[11px] tracking-[0.2em] uppercase">Serves 2</p>
          </div>
        </Reveal>
        <ul className="mt-4 divide-y divide-stone-300/80 border-y border-stone-300/80">
          {meal.recipe.ingredients.map((ing, i) => (
            <Reveal key={i} delay={i * 50}>
              <li>
                <label className="flex items-center gap-3 py-2.5 cursor-pointer group">
                  <div className="w-4 h-4 rounded-[5px] border border-stone-400/70 flex items-center justify-center group-hover:border-[#E8650A] transition-colors shrink-0">
                    <IconCheck size={11} stroke="#E8650A" className="opacity-0 group-[.checked]:opacity-100" />
                  </div>
                  <span className="font-display text-[13px] font-bold text-[#E8650A] w-16 shrink-0">{ing.n}</span>
                  <span className="text-stone-700 text-[13px] flex-1">{ing.t}</span>
                </label>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ═══════════ METHOD ═══════════ */}
      <section className="px-5 pt-7">
        <Reveal>
          <Eyebrow num="03">Method</Eyebrow>
          <h3 className="font-display text-[26px] font-black leading-none text-stone-900 mt-3">How to make it</h3>
        </Reveal>
        <ol className="mt-5 space-y-4">
          {meal.recipe.steps.map((s, i) => (
            <Reveal key={i} delay={i * 80}>
              <li className="flex gap-3.5">
                <span className="font-display text-[22px] font-bold text-[#E8650A]/80 leading-none shrink-0 w-5 text-right tabular-nums">{s.n}</span>
                <div className="flex-1 border-l-2 border-stone-300/70 pl-4">
                  <h4 className="font-display text-[16px] font-bold text-stone-900 leading-snug">{s.t}</h4>
                  <p className="text-stone-600 text-[13px] mt-1 leading-relaxed">{s.d}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ═══════════ CHEF TIP + CTA ═══════════ */}
      <section className="px-5 pt-7 space-y-4">
        <div className="bg-[#EBE3D3] rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0">
              <IconChef size={15} stroke="#E8650A" />
            </div>
            <div className="flex-1">
              <p className="font-display italic text-[#1A1208] text-[14px] leading-[1.55]">
                Taste, adjust, taste again. A recipe is a map — your stove and your palate are the compass.
              </p>
              <p className="text-stone-500 text-[10px] mt-2 tracking-[0.15em] uppercase">Chef's Tip</p>
            </div>
          </div>
        </div>

        <button className="w-full bg-[#1A1208] text-white py-3.5 rounded-2xl text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-2 hover:bg-[#2A1F0F] active:scale-[0.98] transition-all">
          <IconPan size={14}/> Buy Missing Ingredients →
        </button>
      </section>

    </div>
  )
}
