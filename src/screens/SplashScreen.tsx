import { IconArrowRight } from '../components'
import { IMGS } from '../data'

export function SplashScreen({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-[#1A1208]">
      <div className="absolute inset-0 slow-zoom">
        <img src={IMGS.pastaHand} alt="Pasta" className="w-full h-full object-cover opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#1A1208]/95" />
      </div>

      <div className="absolute top-10 left-0 right-0 flex flex-col items-center text-white/70">
        <div className="fade-up text-[9px] tracking-[0.5em] uppercase">Issue № 01 · 风味图谱</div>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <div className="fade-up-delay-1 mb-6">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="26" stroke="#E8650A" strokeWidth="0.8" opacity="0.7" strokeDasharray="2 2" />
            <circle cx="28" cy="28" r="18" stroke="#E8650A" strokeWidth="0.8" opacity="0.5" />
            <circle cx="28" cy="28" r="2.5" fill="#E8650A" />
            <path d="M28 10 L32 26 L28 42 L24 26 Z" fill="#E8650A" opacity="0.85" />
          </svg>
        </div>
        <h1 className="fade-up-delay-1 font-display text-white leading-[0.9] tracking-tight"
          style={{ fontSize: '82px', fontWeight: 900, letterSpacing: '-0.03em' }}>
          Flavor<br/>
          <span style={{ fontStyle: 'italic', color: '#F3ECE0' }}>Atlas</span>
        </h1>
        <div className="fade-up-delay-2 mt-4 flex items-center gap-3 text-white/55">
          <div className="h-px w-6 bg-white/50" />
          <span className="text-[11px] tracking-[0.35em] uppercase">Travel through food</span>
          <div className="h-px w-6 bg-white/50" />
        </div>
        <p className="fade-up-delay-2 font-hand text-white/50 text-[13px] mt-5 max-w-[260px] leading-relaxed">
          A passport for the senses. Taste the world, one dish at a time.
        </p>
      </div>

      <button
        onClick={onEnter}
        className="fade-up-delay-4 absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 text-white group"
      >
        <span className="text-[10px] tracking-[0.45em] uppercase text-white/70 group-hover:text-white transition-colors">Enter the Atlas</span>
        <span className="block mx-auto w-px h-10 bg-gradient-to-b from-white/80 to-transparent relative overflow-hidden">
          <span className="absolute top-0 left-0 w-full h-3 bg-white"
            style={{ animation: 'slideDown 1.8s ease-in-out infinite' }} />
        </span>
        <span className="flex items-center gap-2 text-white/70 text-[11px] tracking-widest group-hover:text-white group-hover:translate-x-1 transition-all">
          Begin <IconArrowRight size={14} />
        </span>
      </button>
    </div>
  )
}