import {
  IconGlobe, IconChef, IconStar, IconBook, IconArrowRight,
  Eyebrow, Stamp, Reveal,
} from '../components'

export function MeScreen() {
  const stamps = [
    { c: 'IT', y: '2024', r: -8 },
    { c: 'JP', y: '2024', r: 6 },
    { c: 'FR', y: '2023', r: -4 },
    { c: 'MX', y: '2024', r: 8 },
    { c: 'TH', y: '2023', r: -6 },
    { c: 'ES', y: '2024', r: 4 },
    { c: 'GR', y: '2025', r: -2 },
    { c: 'IN', y: '2025', r: 10 },
  ]
  const achievements = [
    { Ico: IconGlobe, t: 'World Traveler', cn: '环球旅行者', d: 'Explored 10+ countries', date: 'Mar 2025' },
    { Ico: IconChef,   t: 'Home Chef',    cn: '家庭厨师',   d: 'Completed 30 recipes', date: 'Jan 2025' },
    { Ico: IconStar,   t: 'Flavor Seeker', cn: '风味探索者', d: 'Tried 5 new cuisines', date: 'Nov 2024' },
    { Ico: IconBook,   t: 'Atlas Reader', cn: '图谱阅读者', d: 'Read 50 food stories', date: 'Sep 2024' },
  ]

  return (
    <div className="h-full overflow-y-auto pb-24 bg-[#F3ECE0]">
      <section className="bg-[#1B2845] px-8 pt-14 pb-10 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full bg-[#C9A84C]/10 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-[#C9A84C]/10 blur-2xl" />
        <div className="relative">
          <Reveal>
            <div className="flex items-center gap-2 mb-8">
              <span className="font-display text-[14px] text-[#C9A84C] tracking-[0.3em] uppercase">Republic of Flavor</span>
              <span className="text-[#C9A84C]/40 text-lg">·</span>
              <span className="font-display text-[14px] text-[#C9A84C]/60 tracking-[0.3em] uppercase">风味共和国</span>
            </div>
            <div className="flex items-center gap-5">
              <div className="relative w-20 h-20 rounded-full border-2 border-[#C9A84C]/40 flex items-center justify-center bg-[#C9A84C]/10">
                <svg viewBox="0 0 60 60" width="50" height="50" fill="none">
                  <circle cx="30" cy="30" r="26" stroke="#C9A84C" strokeWidth="0.8" />
                  <circle cx="30" cy="30" r="18" stroke="#C9A84C" strokeWidth="0.6" opacity="0.6" />
                  <path d="M30 12 L34 30 L30 48 L26 30 Z" fill="#C9A84C" opacity="0.9" />
                  <circle cx="30" cy="30" r="2.5" fill="#C9A84C" />
                </svg>
              </div>
              <div>
                <h1 className="font-display text-[32px] font-black text-white leading-none tracking-tight">FLAVOR</h1>
                <h1 className="font-display text-[32px] font-black text-[#C9A84C] leading-none tracking-tight mt-1">ATLAS</h1>
                <p className="text-[#C9A84C]/60 text-[10px] tracking-[0.4em] uppercase mt-2">Travel Passport · 旅行护照</p>
              </div>
            </div>
            <div className="mt-8 border-t border-white/10 pt-6 flex items-end justify-between">
              <div>
                <p className="text-white/40 text-[9px] tracking-[0.4em] uppercase mb-1">Holder · 持有人</p>
                <p className="font-display text-[22px] font-semibold text-white">Alex Chen</p>
                <p className="text-white/40 text-[11px] mt-0.5">Member since January 2023</p>
              </div>
              <div className="text-right">
                <p className="text-white/40 text-[9px] tracking-[0.4em] uppercase">Passport N°</p>
                <p className="font-display text-[18px] text-[#C9A84C] tracking-widest">FA · 0427</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#F3ECE0] px-6 py-10">
        <Reveal>
          <Eyebrow num="01">Your Journey</Eyebrow>
          <div className="mt-6 grid grid-cols-3 gap-0">
            <div className="pr-4 border-r border-stone-300">
              <p className="font-display text-[56px] font-black text-[#E8650A] leading-none">12</p>
              <p className="text-stone-500 text-[11px] mt-1 leading-tight">Countries<br/>Explored · 探索国</p>
            </div>
            <div className="px-4 border-r border-stone-300">
              <p className="font-display text-[56px] font-black text-[#2B5F8E] leading-none">87</p>
              <p className="text-stone-500 text-[11px] mt-1 leading-tight">Dishes<br/>Tasted · 品尝</p>
            </div>
            <div className="pl-4">
              <p className="font-display text-[56px] font-black text-[#4A6741] leading-none">34</p>
              <p className="text-stone-500 text-[11px] mt-1 leading-tight">Recipes<br/>Cooked · 烹饪</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-8 flex items-center gap-4 bg-[#EBE3D3] rounded-2xl px-5 py-4">
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" stroke="#DDD3C2" strokeWidth="3" fill="none" />
                <circle cx="18" cy="18" r="16" stroke="#E8650A" strokeWidth="3" fill="none" strokeDasharray="100" strokeDashoffset="35" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-display text-[15px] font-bold text-stone-900">65%</div>
            </div>
            <div className="flex-1">
              <p className="text-stone-500 text-[10px] tracking-[0.3em] uppercase">Journey Progress</p>
              <p className="font-display text-[18px] font-bold text-stone-900 leading-tight mt-1">65% of the way to<br/>a culinary world tour</p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="bg-[#EBE3D3] py-10">
        <Reveal>
          <div className="px-6">
            <Eyebrow num="02">Passport Stamps</Eyebrow>
            <p className="font-display italic text-stone-600 text-[18px] mt-3">签证印章 ·</p>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="mt-6 relative h-[360px] px-2">
            <div className="absolute top-0 left-3"><Stamp country={stamps[0].c} year={stamps[0].y} rotate={stamps[0].r} active /></div>
            <div className="absolute top-2 right-2"><Stamp country={stamps[1].c} year={stamps[1].y} rotate={stamps[1].r} active /></div>
            <div className="absolute top-24 left-[20%]"><Stamp country={stamps[2].c} year={stamps[2].y} rotate={stamps[2].r} active /></div>
            <div className="absolute top-20 right-[20%]"><Stamp country={stamps[3].c} year={stamps[3].y} rotate={stamps[3].r} active /></div>
            <div className="absolute bottom-4 left-4"><Stamp country={stamps[4].c} year={stamps[4].y} rotate={stamps[4].r} active /></div>
            <div className="absolute bottom-6 left-[35%]"><Stamp country={stamps[5].c} year={stamps[5].y} rotate={stamps[5].r} active /></div>
            <div className="absolute bottom-4 right-6"><Stamp country={stamps[6].c} year={stamps[6].y} rotate={stamps[6].r} active /></div>
            <div className="absolute bottom-0 right-0"><Stamp country={stamps[7].c} year={stamps[7].y} rotate={stamps[7].r} active /></div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-[240px] border-2 border-dashed border-stone-400/40 rounded-sm" style={{ transform: 'rotate(-0.5deg)' }} />
            </div>
          </div>
        </Reveal>
      </section>

      <section className="bg-[#F3ECE0] px-6 py-10">
        <Reveal>
          <Eyebrow num="03">Achievements</Eyebrow>
          <p className="font-display italic text-stone-600 text-[18px] mt-3">成就 ·</p>
        </Reveal>
        <div className="mt-6 relative">
          <svg className="absolute left-[22px] top-2 bottom-2 w-[2px]" preserveAspectRatio="none">
            <line x1="1" y1="0" x2="1" y2="100%" stroke="#8B7355" strokeWidth="1" strokeDasharray="3 5" />
          </svg>
          <div className="space-y-6">
            {achievements.map((a, i) => {
              const I = a.Ico
              return (
                <Reveal key={i} delay={i * 80}>
                  <div className="flex gap-5 items-start">
                    <div className="relative z-10 w-12 h-12 rounded-full bg-white border-2 border-stone-300 flex items-center justify-center shadow-sm flex-shrink-0">
                      <I size={20} stroke="#8B3A2A" />
                    </div>
                    <div className="flex-1 pt-1 border-b border-stone-200 pb-4">
                      <div className="flex items-baseline justify-between">
                        <p className="font-display text-[18px] font-bold text-stone-900">{a.t}</p>
                        <p className="text-stone-400 text-[10px]">{a.date}</p>
                      </div>
                      <p className="text-stone-500 text-xs mt-1">{a.cn} · {a.d}</p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#EBE3D3] px-6 py-10">
        <Reveal>
          <Eyebrow num="04">Favorite Cuisines</Eyebrow>
          <p className="font-display italic text-stone-600 text-[18px] mt-3">最爱菜系 ·</p>
        </Reveal>
        <Reveal delay={100}>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { c: 'Italian', cn: '意大利', color: '#8B3A2A' },
              { c: 'Japanese', cn: '日本', color: '#2B5F8E' },
              { c: 'Mexican', cn: '墨西哥', color: '#C13B2A' },
              { c: 'French', cn: '法国', color: '#4A6741' },
              { c: 'Thai', cn: '泰国', color: '#E8650A' },
              { c: 'Greek', cn: '希腊', color: '#6B7A3F' },
            ].map((c, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-stone-200 text-center hover:shadow-md transition-shadow">
                <div className="w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: c.color + '22', color: c.color }}>
                  <IconStar size={16} />
                </div>
                <p className="font-display text-[14px] font-bold text-stone-900">{c.c}</p>
                <p className="text-stone-400 text-[9px] mt-0.5">{c.cn}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="bg-[#F3ECE0] px-6 py-8 border-t border-stone-300/60">
        {['Language · 语言', 'Notifications · 通知', 'Privacy · 隐私', 'About Flavor Atlas'].map((item, i) => (
          <div key={i} className="py-4 border-b border-stone-200 last:border-0 flex items-center justify-between">
            <p className="text-stone-700 text-sm">{item}</p>
            <IconArrowRight size={14} stroke="#8B7355" />
          </div>
        ))}
      </section>
    </div>
  )
}